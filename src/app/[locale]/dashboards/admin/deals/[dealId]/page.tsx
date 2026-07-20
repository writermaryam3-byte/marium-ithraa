'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, CheckCircle, Handshake, XCircle } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'

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
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useDealDetail, useDealProposals, useApproveProposal, useRejectProposal, DealExecutionPanel } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

const STATUS_KEYS = {
  OPEN: 'open',
  AWARDED: 'awarded',
  CLOSED: 'closed',
} as const

function getStatusLabel(status: string, t: ReturnType<typeof useTranslations<'deals'>>) {
  const key = STATUS_KEYS[status as keyof typeof STATUS_KEYS]
  return key ? t(key) : status
}

export default function AdminDealDetailPage() {
  const params = useParams<{ dealId: string }>()
  const locale = useLocale()
  const t = useTranslations('deals')
  const { data: deal, isLoading: dealLoading } = useDealDetail(params.dealId)
  const { data: proposalsData, isLoading: proposalsLoading } = useDealProposals(params.dealId)
  const approve = useApproveProposal(params.dealId)
  const reject = useRejectProposal(params.dealId)
  const [approveTarget, setApproveTarget] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const proposals = Array.isArray(proposalsData) ? proposalsData : []
  const selectedProposal = proposals.find((p) => p.status === 'SELECTED')
  const approvedProposal = proposals.find((p) => p.status === 'APPROVED')

  if (dealLoading || proposalsLoading) {
    return (
      <>
        <SiteHeader titleKey="navigation.dashboard.deals" />
        <div className="space-y-4 p-4 lg:p-6" dir={getTextDirection(locale)}>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </>
    )
  }

  if (!deal) {
    return (
      <>
        <SiteHeader titleKey="navigation.dashboard.deals" />
        <Card className="m-4 rounded-2xl">
          <CardHeader>
            <CardTitle>{t('notFound')}</CardTitle>
          </CardHeader>
        </Card>
      </>
    )
  }

  return (
    <>
      <SiteHeader titleKey="navigation.dashboard.deals" />
      <div className="flex flex-1 flex-col" dir={getTextDirection(locale)}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
            <Button variant="ghost" size="sm" className="w-fit rounded-xl" asChild>
              <Link href={`${ADMIN_URL}/${Pages.DEALS}`}>
                <ArrowLeft className="size-4 me-2" />
                {t('backToDeals')}
              </Link>
            </Button>

            <Card className="rounded-2xl border-amber-50/70 bg-white/80 shadow-sm">
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
            <Badge variant="outline">{getStatusLabel(deal.status, t)}</Badge>
          </p>
        </CardContent>
      </Card>

      <DealExecutionPanel dealId={params.dealId} deal={deal} />

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
              <Button
                variant="outline"
                onClick={() => setRejectTarget(selectedProposal.id)}
                disabled={reject.isPending}
              >
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

      <Dialog
        open={!!rejectTarget}
        onOpenChange={(o) => {
          if (!o) {
            setRejectTarget(null)
            setRejectReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmReject')}</DialogTitle>
            <DialogDescription>{t('confirmRejectDesc')}</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={t('rejectReason')}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!rejectTarget) return
                try {
                  await reject.mutateAsync({
                    proposalId: rejectTarget,
                    reason: rejectReason.trim() || undefined,
                  })
                  setRejectTarget(null)
                  setRejectReason('')
                } catch {}
              }}
              disabled={reject.isPending}
            >
              {reject.isPending ? t('rejecting') : t('confirmRejectAction')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}
