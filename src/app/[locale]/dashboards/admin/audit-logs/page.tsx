'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SiteHeader } from '@/components/site-header'
import { useAuditLogs } from '@/features/audit-logs'

const ALL = 'all'
const LIMIT = 20

export default function AdminAuditLogsPage() {
  const t = useTranslations('auditLogs')
  const [page, setPage] = useState(1)
  const [entityType, setEntityType] = useState('')
  const [actionFilter, setActionFilter] = useState(ALL)

  const { data, isLoading, isError } = useAuditLogs({
    page,
    limit: LIMIT,
    entityType: entityType.trim() || undefined,
    action: actionFilter === ALL ? undefined : actionFilter,
  })

  const items = data?.items ?? []
  const meta = data?.meta
  const totalPages = meta?.totalPages ?? 1

  return (
    <>
      <SiteHeader title={t('title')} />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filterEntityType')}
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value)
              setPage(1)
            }}
            className="max-w-xs"
          />
          <Select
            value={actionFilter}
            onValueChange={(value) => {
              setActionFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('filterAllActions')}</SelectItem>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="APPROVE">APPROVE</SelectItem>
              <SelectItem value="REJECT">REJECT</SelectItem>
              <SelectItem value="PAYMENT_SUCCESS">PAYMENT_SUCCESS</SelectItem>
              <SelectItem value="DEAL_APPROVE">DEAL_APPROVE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">{t('loadError')}</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">{t('empty')}</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columnTime')}</TableHead>
                  <TableHead>{t('columnAction')}</TableHead>
                  <TableHead>{t('columnEntity')}</TableHead>
                  <TableHead>{t('columnUser')}</TableHead>
                  <TableHead>{t('columnDescription')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="font-medium">{log.entityType}</span>
                      <span className="block text-xs text-muted-foreground truncate max-w-[180px]">
                        {log.entityId}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span>{log.userEmail}</span>
                      <span className="block text-xs text-muted-foreground">{log.userRole}</span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {log.description ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {t('pageInfo', { page: meta?.page ?? page, totalPages })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta?.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t('previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta?.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('next')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
