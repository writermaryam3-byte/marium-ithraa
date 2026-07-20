import { parseResponse, unwrapPaginatedList } from '@/lib/api/utils'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { PaginationMeta } from '@/lib/types/interfaces'
import type { AuditLog, ListAuditLogsParams } from '../types'

const buildQuery = (params?: ListAuditLogsParams) => {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.entityType) qs.set('entityType', params.entityType)
  if (params?.entityId) qs.set('entityId', params.entityId)
  if (params?.userId) qs.set('userId', params.userId)
  if (params?.action) qs.set('action', params.action)
  const query = qs.toString()
  return query ? `?${query}` : ''
}

export type ListAuditLogsResult = {
  items: AuditLog[]
  meta: PaginationMeta
}

export const listAuditLogs = async (params?: ListAuditLogsParams): Promise<ListAuditLogsResult> => {
  const session = await import('next-auth/react').then((m) => m.getSession())
  const token = session?.user?.accessToken

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${Endpoint.AUDIT_LOGS}${buildQuery(params)}`,
    { method: Methods.GET, headers },
  )

  const envelope = await parseResponse<AuditLog[]>(res)
  return unwrapPaginatedList(envelope)
}
