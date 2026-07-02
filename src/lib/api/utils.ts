import { ApiError } from '../errors/ApiError'
import { StatusCode } from '../types/enums'
import type { ValidationErrors } from '../types/types'
import { logger } from '../logger'

export function getApiErrorMessage(data: unknown): string {
  if (typeof data === 'string') return data

  if (typeof data !== 'object' || data === null) return 'Request failed'

  const maybeMessage = (data as { message?: unknown }).message
  if (typeof maybeMessage === 'string') return maybeMessage
  if (Array.isArray(maybeMessage)) {
    return maybeMessage.filter((item): item is string => typeof item === 'string').join(', ')
  }

  const maybeErrors = (data as { errors?: unknown }).errors
  if (typeof maybeErrors === 'object' && maybeErrors !== null) {
    const messages = Object.values(maybeErrors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === 'string')

    if (messages.length > 0) return messages.join(', ')
  }

  return 'Request failed'
}

export function getValidationErrors(data: unknown): ValidationErrors | undefined {
  if (typeof data !== 'object' || data === null) return undefined

  const record = data as Record<string, unknown>
  const maybeErrors = record.errors ?? record.message

  if (typeof maybeErrors === 'object' && maybeErrors !== null && !Array.isArray(maybeErrors)) {
    const errors = Object.entries(maybeErrors).reduce<ValidationErrors>((acc, [key, value]) => {
      if (Array.isArray(value)) {
        const messages = value.filter((item): item is string => typeof item === 'string')
        if (messages.length > 0) acc[key] = messages
        return acc
      }

      if (typeof value === 'string') acc[key] = [value]
      return acc
    }, {})

    return Object.keys(errors).length > 0 ? errors : undefined
  }

  return undefined
}

export async function parseResponse<T>(res: Response): Promise<T> {
  let data: unknown
  try {
    data = await res.json()
  } catch (err) {
    logger.error('Failed to parse JSON response', { error: err })
    throw new ApiError('Invalid server response', StatusCode.INTERNALSERVERERROR)
  }

  if (!res.ok) {
    const message = getApiErrorMessage(data)
    const errors = getValidationErrors(data)
    logger.error('API request failed', {
      statusCode: res.status,
      message,
    })
    throw new ApiError(message, res.status, errors)
  }

  return data as T
}

export function buildHeaders(
  token?: string | null,
  additionalHeaders?: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (additionalHeaders) {
    const entries =
      additionalHeaders instanceof Headers
        ? Array.from(additionalHeaders.entries())
        : Array.isArray(additionalHeaders)
          ? additionalHeaders
          : Object.entries(additionalHeaders)
    for (const [key, value] of entries) {
      headers[key] = value
    }
  }
  return headers
}
