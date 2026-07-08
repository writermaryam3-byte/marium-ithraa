import { getSession, signOut } from 'next-auth/react'

import { ApiError } from '../errors/ApiError'
import { ApiErrorCodes, Pages, Routes, StatusCode } from '../types/enums'
import { logger, metrics } from '../logger'
import { buildHeaders, parseResponse } from './utils'

let cachedToken: string | null = null
let tokenRefreshAttempts = 0
const MAX_TOKEN_REFRESH_ATTEMPTS = 1

export function clearAuthTokenCache() {
  cachedToken = null
  tokenRefreshAttempts = 0
}

export function setAuthTokenCache(token: string | null) {
  cachedToken = token
}

export function getCachedAuthToken() {
  return cachedToken
}

async function resolveAccessToken(): Promise<string | null> {
  const session = await getSession()

  if (session?.error === 'RefreshAccessTokenError') {
    logger.warn('RefreshAccessTokenError, signing out', { error: session.error })
    clearAuthTokenCache()
    await signOut({
      callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}`,
      redirect: true,
    })
    return null
  }

  const token = session?.user?.accessToken ?? null
  cachedToken = token
  return token
}

function shouldRetry(statusCode: number, attempt: number): boolean {
  if (attempt >= 2) return false // Max 2 retries
  // Retry only on network errors or 5xx
  return statusCode >= 500 || statusCode === 0 // 0 for network errors
}

export async function clientApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
  timeoutMs = 10000,
  attempt = 0,
): Promise<T> {
  const start = Date.now()
  const method = options.method || 'GET'

  logger.info('Starting client API request', { endpoint, method, attempt })

  const token = await resolveAccessToken()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`, {
      ...options,
      headers: buildHeaders(token, options.headers),
      signal: controller.signal,
    })

    const duration = Date.now() - start
    logger.info('Client API request completed', {
      endpoint,
      method,
      statusCode: res.status,
      duration,
      attempt,
    })

    if (res.status === StatusCode.UNAUTHORIZED) {
      logger.warn('Unauthorized request', { endpoint, retryOnUnauthorized, tokenRefreshAttempts })
      clearAuthTokenCache()

      if (retryOnUnauthorized && tokenRefreshAttempts < MAX_TOKEN_REFRESH_ATTEMPTS) {
        tokenRefreshAttempts++
        const refreshed = await resolveAccessToken()
        if (refreshed && refreshed !== token) {
          logger.info('Retrying with refreshed token', { endpoint })
          return clientApiFetch<T>(endpoint, options, false, timeoutMs, attempt)
        }
      }

      logger.info('Signing out due to unauthorized', { endpoint })
      await signOut({
        callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}`,
        redirect: true,
      })
      throw new ApiError(endpoint, StatusCode.UNAUTHORIZED, {
        code: ApiErrorCodes.UNAUTHORIZED,
        message: 'errors.common.unauthorized',
      })
    }

    if (!res.ok && shouldRetry(res.status, attempt)) {
      metrics.incrementRetry()
      logger.info('Retrying request', {
        endpoint,
        method,
        statusCode: res.status,
        attempt: attempt + 1,
      })
      return clientApiFetch<T>(endpoint, options, retryOnUnauthorized, timeoutMs, attempt + 1)
    }

    const data = await parseResponse<T>(res)
    tokenRefreshAttempts = 0 // Reset on success
    return data
  } catch (err) {
    const duration = Date.now() - start

    if (err instanceof Error && err.name === 'AbortError') {
      logger.error('Client API request timed out', { endpoint, method, duration, attempt })
      metrics.incrementFailed()
      throw new Error('Request timed out')
    }

    // If it's a network error and we can retry
    if (err instanceof Error && shouldRetry(0, attempt)) {
      metrics.incrementRetry()
      logger.info('Retrying due to network error', { endpoint, method, attempt: attempt + 1 })
      return clientApiFetch<T>(endpoint, options, retryOnUnauthorized, timeoutMs, attempt + 1)
    }

    logger.error('Client API request failed', { endpoint, method, duration, error: err, attempt })
    metrics.incrementFailed()
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}
