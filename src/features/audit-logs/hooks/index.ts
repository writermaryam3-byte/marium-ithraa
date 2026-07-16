'use client'

import { useQuery } from '@tanstack/react-query'
import { listAuditLogs, type ListAuditLogsResult } from '../api'
import type { ListAuditLogsParams } from '../types'

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (params?: ListAuditLogsParams) => [...auditLogKeys.all, 'list', params ?? {}] as const,
}

export function useAuditLogs(params?: ListAuditLogsParams) {
  return useQuery<ListAuditLogsResult>({
    queryKey: auditLogKeys.list(params),
    queryFn: () => listAuditLogs(params),
    staleTime: 10_000,
  })
}
