import { getSession, signOut } from 'next-auth/react'

import { ApiError } from '../errors/ApiError'
import { getLocalizedLoginPath } from '@/features/auth/utils/redirects'
import { getLocaleFromWindowPathname } from '@/lib/i18n/pathname'
import { ApiErrorCodes, StatusCode } from '../types/enums'
import { logger, metrics } from '../logger'
import { buildHeaders, fetchData } from './utils'

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
      callbackUrl: getLocalizedLoginPath(getLocaleFromWindowPathname()),
      redirect: true,
    })
    return null
  }

  const token = session?.user?.accessToken ?? null
  cachedToken = token
  return token
}

function shouldRetry(statusCode: number, attempt: number): boolean {
  if (attempt >= 2) return false
  return statusCode >= 500 || statusCode === 0
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...buildHeaders(token, options.headers),
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`, {
      ...options,
      headers,
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
        callbackUrl: getLocalizedLoginPath(getLocaleFromWindowPathname()),
        redirect: true,
      })
      throw new ApiError(endpoint, StatusCode.UNAUTHORIZED, {
        code: ApiErrorCodes.AUTH_UNAUTHORIZED,
        message: 'errors.auth.unauthorized',
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

    const data = await fetchData<T>(res)
    tokenRefreshAttempts = 0
    return data
  } catch (err) {
    const duration = Date.now() - start

    if (err instanceof ApiError) throw err

    if (err instanceof Error && err.name === 'AbortError') {
      logger.error('Client API request timed out', { endpoint, method, duration, attempt })
      metrics.incrementFailed()
      throw new ApiError(endpoint, StatusCode.INTERNALSERVERERROR, {
        code: ApiErrorCodes.INTERNAL_UNEXPECTED,
        message: 'errors.common.internalServerError',
      })
    }

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
