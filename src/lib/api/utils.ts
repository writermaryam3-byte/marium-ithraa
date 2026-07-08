import { ApiError } from '../errors/ApiError'
import { ApiErrorCodes, StatusCode } from '../types/enums'
import { logger } from '../logger'
import { ApiErrorResponse, ApiSuccessResponse } from '../types/interfaces'

export async function parseResponse<T>(res: Response): Promise<T> {
  let data: ApiSuccessResponse<T> | ApiErrorResponse
  try {
    data = await res.json()
  } catch (err) {
    logger.error('Failed to parse JSON response', { error: err })
    throw new ApiError('', StatusCode.INTERNALSERVERERROR, {
      code: ApiErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'errors.common.internalServerError',
    })
  }

  if (!res.ok || !data.success) {
    data = data as ApiErrorResponse
    logger.error('API request failed', {
      statusCode: res.status,
      path: data.path,
    } as any)
    throw new ApiError(data.path, res.status, {
      code: data.error.code as ApiErrorCodes,
      message: data.error.message,
      details: data.error.details,
      fieldErrors: data.error.fieldErrors,
      requestId: data.requestId,
      timestamp: data.timestamp,
    })
  }

  return (data as ApiSuccessResponse<T>).data
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
