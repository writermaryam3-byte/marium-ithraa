import { ApiError } from '../errors/ApiError'
import { ApiErrorCodes, StatusCode } from '../types/enums'
import { logger } from '../logger'
import { ApiErrorResponse, ApiSuccessResponse } from '../types/types/interfaces'

export async function parseResponse<T>(res: Response): Promise<T> {
  let data: ApiSuccessResponse<T> | ApiErrorResponse
  try {
    data = await res.json()
    console.log("i'am the res of api server=> ", data)
  } catch (err) {
    logger.error('Failed to parse JSON response', { error: err })
    throw new ApiError('', StatusCode.INTERNALSERVERERROR, {
      code: ApiErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'internal server error',
    })
  }

  if (!res.ok || !data.success) {
    data = data as ApiErrorResponse
    const message = data.error.message
    logger.error('API request failed', {
      statusCode: res.status,
      message,
      path: data.path,
    })
    throw new ApiError(data.path, data.statusCode, data.error)
  }

  return data.data
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
