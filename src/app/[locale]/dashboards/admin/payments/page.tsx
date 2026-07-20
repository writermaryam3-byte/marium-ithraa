'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ExternalLink } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useAdminPayments } from '@/features/payments/hooks'

const ALL = 'all'
const LIMIT = 20

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  paid: 'default',
  failed: 'destructive',
  expired: 'outline',
}

export default function AdminPaymentsPage() {
  const t = useTranslations('payments.admin')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState(ALL)

  const { data, isLoading, isError } = useAdminPayments({
    page,
    limit: LIMIT,
    status: statusFilter === ALL ? undefined : statusFilter,
  })

  const items = data?.items ?? []
  const meta = data?.meta
  const totalPages = meta?.totalPages ?? 1

  return (
    <>
      <SiteHeader title={t('title')} />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('filterAll')}</SelectItem>
            <SelectItem value="pending">{t('filterPending')}</SelectItem>
            <SelectItem value="paid">{t('filterPaid')}</SelectItem>
            <SelectItem value="failed">{t('filterFailed')}</SelectItem>
            <SelectItem value="expired">{t('filterExpired')}</SelectItem>
          </SelectContent>
        </Select>

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
                  <TableHead>{t('columnUser')}</TableHead>
                  <TableHead>{t('columnAmount')}</TableHead>
                  <TableHead>{t('columnStatus')}</TableHead>
                  <TableHead>{t('columnPurpose')}</TableHead>
                  <TableHead>{t('columnProvider')}</TableHead>
                  <TableHead>{t('columnCreated')}</TableHead>
                  <TableHead>{t('columnActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      <span>{payment.userName ?? payment.userEmail ?? payment.userId}</span>
                      {payment.userEmail && payment.userName && (
                        <span className="block text-xs text-muted-foreground">{payment.userEmail}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.amount} {payment.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[payment.status] ?? 'outline'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.purpose ?? '—'}</TableCell>
                    <TableCell>{payment.provider}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {payment.paymentUrl ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={payment.paymentUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 me-1" />
                            {t('openCheckout')}
                          </a>
                        </Button>
                      ) : (
                        '—'
                      )}
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
