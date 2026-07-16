import { ApiError } from '../errors/ApiError'
import { ApiErrorCodes, StatusCode } from '../types/enums'
import { logger } from '../logger'
import type { ApiErrorResponse, ApiSuccessResponse, PaginationMeta } from '../types/interfaces'

export type PaginatedListPayload<T> = {
  data: T[]
  meta: PaginationMeta
}

const defaultPaginationMeta = (): PaginationMeta => ({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})

export function unwrapPaginatedList<T>(
  envelope: ApiSuccessResponse<PaginatedListPayload<T> | T[]>,
): { items: T[]; meta: PaginationMeta } {
  const payload = envelope.data
  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    'data' in payload &&
    'meta' in payload
  ) {
    const paginated = payload as PaginatedListPayload<T>
    return { items: paginated.data, meta: paginated.meta }
  }

  return {
    items: Array.isArray(payload) ? payload : [],
    meta: envelope.meta ?? defaultPaginationMeta(),
  }
}

export async function parseResponse<T>(res: Response): Promise<ApiSuccessResponse<T>> {
  let raw: Record<string, unknown>
  try {
    raw = await res.json()
  } catch (err) {
    logger.error('Failed to parse JSON response', { error: err })
    throw new ApiError('', StatusCode.INTERNALSERVERERROR, {
      code: ApiErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'errors.common.internalServerError',
    })
  }

  if (!res.ok || !raw.success) {
    const errorResp = raw as unknown as ApiErrorResponse
    logger.error('API request failed', {
      statusCode: res.status,
      path: errorResp.path,
    })
    throw new ApiError(errorResp.path ?? '', res.status, {
      code: errorResp.error?.code ?? 'UNKNOWN',
      message: errorResp.error?.message ?? 'errors.common.internalServerError',
      details: errorResp.error?.details,
      fieldErrors: errorResp.error?.fieldErrors,
      requestId: errorResp.requestId,
      timestamp: errorResp.timestamp,
    })
  }

  return raw as unknown as ApiSuccessResponse<T>
}

export async function fetchData<T>(res: Response): Promise<T> {
  const envelope = await parseResponse<T>(res)
  return envelope.data
}

export async function fetchPaginatedData<T>(res: Response): Promise<{ data: T; meta: NonNullable<ApiSuccessResponse<T>['meta']> }> {
  const envelope = await parseResponse<T>(res)
  return {
    data: envelope.data,
    meta: envelope.meta ?? {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }
}

export function buildHeaders(
  token?: string | null,
  additionalHeaders?: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {}
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
