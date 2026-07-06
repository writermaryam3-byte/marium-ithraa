// lib/server-api-client.ts

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { StatusCode } from '../types/enums'
import nextAuthOptions from '@/server/auth'
import { logger, metrics } from '../logger'
import { buildHeaders, parseResponse } from './utils'

export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 10000,
): Promise<T> {
  const start = Date.now()
  const method = options.method || 'GET'
  logger.info('Starting server API request', { endpoint, method })

  const session = await getServerSession(nextAuthOptions)
  const token = session?.user?.accessToken

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api${endpoint}`, {
      ...options,
      headers: buildHeaders(token, options.headers),
      cache: 'no-store',
      signal: controller.signal,
    })

    const duration = Date.now() - start
    logger.info('Server API request completed', {
      endpoint,
      method,
      statusCode: res.status,
      duration,
    })

    if (res.status === StatusCode.UNAUTHORIZED) {
      logger.warn('Unauthorized, redirecting to login', { endpoint })
      redirect('/auth/login')
    }

    const data = await parseResponse<T>(res)
    return data
  } catch (err) {
    const duration = Date.now() - start
    if (err instanceof Error && err.name === 'AbortError') {
      logger.error('Server API request timed out', { endpoint, method, duration })
      metrics.incrementFailed()
      throw new Error('Request timed out')
    }
    logger.error('Server API request failed', { endpoint, method, duration, error: err })
    metrics.incrementFailed()
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}
