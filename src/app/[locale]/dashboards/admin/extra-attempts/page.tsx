'use client'

import { useLocale, useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
  useApproveExtraAttempt,
  useExtraAttemptRequests,
  useRejectExtraAttempt,
} from '@/features/evaluations/hooks'
import type { ExtraAttemptRequest } from '@/features/evaluations/api'
import { getDateLocale, getTextDirection } from '@/lib/i18n/locale-utils'

export default function AdminExtraAttemptsPage() {
  const t = useTranslations('evaluations.adminExtraRequests')
  const locale = useLocale()
  const { data: requests = [], isLoading, isError } = useExtraAttemptRequests()

  return (
    <>
      <SiteHeader title={t('title')} />
      <div className="flex flex-1 flex-col gap-4 p-6" dir={getTextDirection(locale)}>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">{t('loadError')}</p>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground">{t('empty')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colChild')}</TableHead>
                <TableHead>{t('colParent')}</TableHead>
                <TableHead>{t('colContact')}</TableHead>
                <TableHead>{t('colQuantity')}</TableHead>
                <TableHead>{t('colAmount')}</TableHead>
                <TableHead>{t('colStatus')}</TableHead>
                <TableHead>{t('colDate')}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.childName ?? req.childId ?? '—'}</TableCell>
                  <TableCell>{req.parentName ?? req.parentId}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {req.parentEmail ?? req.parentPhone ?? '—'}
                  </TableCell>
                  <TableCell className="tabular-nums">{req.quantity}</TableCell>
                  <TableCell className="tabular-nums">
                    {req.amountSar} {t('currency')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'REQUESTED' ? 'secondary' : 'outline'}>
                      {req.status === 'REQUESTED'
                        ? t('statusRequested')
                        : t('statusAwaitingPayment')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString(getDateLocale(locale))}
                  </TableCell>
                  <TableCell>
                    <ExtraRequestActions request={req} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

function ExtraRequestActions({ request }: { request: ExtraAttemptRequest }) {
  const t = useTranslations('evaluations.adminExtraRequests')
  const approve = useApproveExtraAttempt()
  const reject = useRejectExtraAttempt()

  const handleApprove = async () => {
    try {
      const result = await approve.mutateAsync(request.id)
      showSuccessToast({ raw: t('approvedToast') })
      if (result?.payment?.checkoutUrl) {
        window.open(result.payment.checkoutUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  const handleReject = async () => {
    try {
      await reject.mutateAsync(request.id)
      showSuccessToast({ raw: t('rejectedToast') })
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {request.status === 'REQUESTED' && (
        <Button size="sm" onClick={handleApprove} disabled={approve.isPending}>
          {t('approve')}
        </Button>
      )}
      {request.status === 'REQUESTED' && (
        <Button size="sm" variant="destructive" onClick={handleReject} disabled={reject.isPending}>
          {t('reject')}
        </Button>
      )}
    </div>
  )
}
