'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Handshake, CheckCircle, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { useDealDetail, useDealProposals, useApproveProposal } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

export default function AdminDealDetailPage() {
  const params = useParams<{ dealId: string }>()
  const locale = useLocale()
  const t = useTranslations('Features.Deals')
  const { data: deal, isLoading: dealLoading } = useDealDetail(params.dealId)
  const { data: proposalsData, isLoading: proposalsLoading } = useDealProposals(params.dealId)
  const approve = useApproveProposal(params.dealId)
  const [approveTarget, setApproveTarget] = useState<string | null>(null)

  const proposals = Array.isArray(proposalsData) ? proposalsData : []
  const selectedProposal = proposals.find((p) => p.status === 'SELECTED')
  const approvedProposal = proposals.find((p) => p.status === 'APPROVED')

  if (dealLoading || proposalsLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!deal) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>{t('notFound')}</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6" dir={getTextDirection(locale)}>
      <Link href={`${ADMIN_URL}/${Pages.DEALS}`}>← {t('backToDeals')}</Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="size-5" />
            {deal.activity?.name ?? t('deal')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          <p>
            <span className="text-muted-foreground">{t('organization')}: </span>
            {deal.organization?.organizationName ?? '—'}
          </p>
          <p>
            <span className="text-muted-foreground">{t('studentsCount')}: </span>
            {deal.studentsCount}
          </p>
          <p>
            <span className="text-muted-foreground">{t('status')}: </span>
            <Badge>{deal.status}</Badge>
          </p>
        </CardContent>
      </Card>

      {approvedProposal && (
        <Card className="border-green-300 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-base text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="size-4" />
              {t('approved')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">{t('enricher')}: </span>
              {approvedProposal.enricher?.name ?? '—'}
            </p>
            <p>
              <span className="text-muted-foreground">{t('price')}: </span>
              {approvedProposal.price}
            </p>
          </CardContent>
        </Card>
      )}

      {selectedProposal && !approvedProposal && (
        <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-base text-yellow-700 dark:text-yellow-400">
              {t('pendingApproval')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">{t('enricher')}: </span>
                {selectedProposal.enricher?.name ?? '—'}
              </p>
              <p>
                <span className="text-muted-foreground">{t('price')}: </span>
                {selectedProposal.price}
              </p>
              <p>
                <span className="text-muted-foreground">{t('submittedAt')}: </span>
                {selectedProposal.createdAt
                  ? new Date(selectedProposal.createdAt).toLocaleDateString()
                  : '—'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setApproveTarget(selectedProposal.id)}
                disabled={approve.isPending}
              >
                <CheckCircle className="size-4 me-1" />
                {t('approve')}
              </Button>
              <Button variant="outline" disabled>
                <XCircle className="size-4 me-1" />
                {t('reject')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedProposal && !approvedProposal && (
        <p className="text-sm text-muted-foreground text-center py-8">{t('noSelectedProposal')}</p>
      )}

      <Dialog
        open={!!approveTarget}
        onOpenChange={(o) => {
          if (!o) setApproveTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmApproval')}</DialogTitle>
            <DialogDescription>{t('confirmApprovalDesc')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApproveTarget(null)}>
              {t('cancel')}
            </Button>
            <Button
              onClick={async () => {
                if (!approveTarget) return
                try {
                  await approve.mutateAsync(approveTarget)
                  setApproveTarget(null)
                } catch {}
              }}
              disabled={approve.isPending}
            >
              {approve.isPending ? t('approving') : t('confirmApprove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
