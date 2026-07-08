'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Handshake } from 'lucide-react'

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
import { useDealDetail, useDealProposals, useSelectProposal } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const ORG_URL = `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`

export default function OrganizationDealDetailPage() {
  const params = useParams<{ dealId: string }>()
  const locale = useLocale()
  const t = useTranslations('deals')
  const { data: deal, isLoading: dealLoading } = useDealDetail(params.dealId)
  const { data: proposalsData, isLoading: proposalsLoading } = useDealProposals(params.dealId)
  const select = useSelectProposal(params.dealId)
  const [selectTarget, setSelectTarget] = useState<string | null>(null)

  const proposals = Array.isArray(proposalsData) ? proposalsData : []
  const selectedProposal = proposals.find((p) => p.status === 'SELECTED' || p.status === 'APPROVED')

  if (dealLoading || proposalsLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
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
      <Link href={`${ORG_URL}/${Pages.DEALS}`}>← {t('backToDeals')}</Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="size-5" />
            {deal.activity?.name ?? t('deal')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          <p>
            <span className="text-muted-foreground">{t('studentsCount')}: </span>
            {deal.studentsCount}
          </p>
          <p>
            <span className="text-muted-foreground">{t('status')}: </span>
            <Badge
              variant={
                deal.status === 'OPEN'
                  ? 'default'
                  : deal.status === 'AWARDED'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {deal.status}
            </Badge>
          </p>
          {deal.deadline && (
            <p>
              <span className="text-muted-foreground">{t('deadline')}: </span>
              {new Date(deal.deadline).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {selectedProposal && (
        <Card className="border-green-300 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-base text-green-700 dark:text-green-400">
              {t('winnerSelected')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">{t('enricher')}: </span>
              {selectedProposal.enricher?.name ?? '—'}
            </p>
            <p>
              <span className="text-muted-foreground">{t('price')}: </span>
              {selectedProposal.price}
            </p>
            <p>
              <span className="text-muted-foreground">{t('proposalStatus')}: </span>
              <Badge>{selectedProposal.status}</Badge>
            </p>
            {selectedProposal.status === 'SELECTED' && (
              <p className="text-yellow-600 dark:text-yellow-400 text-xs">
                {t('pendingAdminApproval')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {proposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('proposals')} ({proposals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{p.enricher?.name ?? '—'}</p>
                  <p className="text-muted-foreground">
                    {t('price')}: {p.price}
                  </p>
                  <Badge
                    variant={
                      p.status === 'APPROVED'
                        ? 'default'
                        : p.status === 'SELECTED'
                          ? 'secondary'
                          : p.status === 'REJECTED'
                            ? 'outline'
                            : 'default'
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
                {deal.status === 'OPEN' && p.status === 'PENDING' && (
                  <Button size="sm" onClick={() => setSelectTarget(p.id)}>
                    {t('selectWinner')}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {proposals.length === 0 && deal.status === 'OPEN' && (
        <p className="text-sm text-muted-foreground text-center py-8">{t('noProposals')}</p>
      )}

      <Dialog
        open={!!selectTarget}
        onOpenChange={(o) => {
          if (!o) setSelectTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmSelection')}</DialogTitle>
            <DialogDescription>{t('confirmSelectionDesc')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectTarget(null)}>
              {t('cancel')}
            </Button>
            <Button
              onClick={async () => {
                if (!selectTarget) return
                try {
                  await select.mutateAsync(selectTarget)
                  setSelectTarget(null)
                } catch {}
              }}
              disabled={select.isPending}
            >
              {select.isPending ? t('selecting') : t('confirmWin')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
