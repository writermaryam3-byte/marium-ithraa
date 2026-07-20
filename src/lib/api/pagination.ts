import type { PaginationMeta } from '@/lib/types/interfaces'

export type PaginationParams = {
  page?: number
  limit?: number
  search?: string
}

export function buildPaginationQuery(params?: PaginationParams): string {
  if (!params) return ''

  const query = new URLSearchParams()
  if (params.page != null) query.set('page', String(params.page))
  if (params.limit != null) query.set('limit', String(params.limit))
  if (params.search?.trim()) query.set('search', params.search.trim())

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

export function paginateArray<T>(items: T[], page: number, limit: number): T[] {
  const safePage = Math.max(1, page)
  const safeLimit = Math.max(1, limit)
  const start = (safePage - 1) * safeLimit
  return items.slice(start, start + safeLimit)
}

export function getPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const safeLimit = Math.max(1, limit)
  const totalPages = Math.max(1, Math.ceil(total / safeLimit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  }
}
