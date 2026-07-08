'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { showErrorToast } from '@/lib/toast/app-toast'
import { Pencil } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useEnricherDealDetail, useEnricherProposals } from '@/features/enricher'
import { useSubmitProposal, useUpdateProposal } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const ENRICHER_URL = `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`

export default function EnricherDealDetailPage() {
  const params = useParams<{ dealId: string }>()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('deals.enricher')
  const [price, setPrice] = useState('')
  const { data: deal, isLoading } = useEnricherDealDetail(params.dealId)
  const { data: myProposals } = useEnricherProposals()
  const submit = useSubmitProposal(params.dealId, () => {
    router.push(`${ENRICHER_URL}/${Pages.PROPOSALS}`)
  })
  const update = useUpdateProposal()

  const existingProposal = Array.isArray(myProposals)
    ? myProposals.find((p) => p.dealId === params.dealId)
    : undefined

  const canSubmitOrEdit = deal?.status === 'OPEN'

  if (isLoading) {
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
      <Link href={`${ENRICHER_URL}/${Pages.DEALS}`}>← {t('backToDeals')}</Link>

      <Card>
        <CardHeader>
          <CardTitle>{deal.activity?.name ?? 'Deal'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
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
          {deal.deadline && (
            <p>
              <span className="text-muted-foreground">{t('deadline')}: </span>
              {new Date(deal.deadline).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {existingProposal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('yourProposal')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="text-muted-foreground">{t('price')}: </span>
              {existingProposal.price}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">{t('status')}: </span>
              <Badge>{existingProposal.status}</Badge>
            </p>
          </CardContent>
        </Card>
      )}

      {canSubmitOrEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Pencil className="size-4" />
              {existingProposal ? t('updateProposal') : t('submitProposal')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>{t('price')}</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={existingProposal ? String(existingProposal.price) : '0.00'}
                min="0"
                step="0.01"
              />
            </div>
            <Button
              onClick={async () => {
                const amount = parseFloat(price)
                if (isNaN(amount) || amount <= 0) {
                  showErrorToast(t, 'invalidPrice')
                  return
                }
                try {
                  if (existingProposal) {
                    await update.mutateAsync({ proposalId: existingProposal.id, price: amount })
                  } else {
                    await submit.mutateAsync({ price: amount })
                  }
                  setPrice('')
                } catch {
                  showErrorToast({
                    raw: existingProposal ? t('failedUpdateProposal') : t('submitError'),
                  })
                }
              }}
              disabled={submit.isPending || update.isPending}
            >
              {submit.isPending || update.isPending
                ? t('submitting')
                : existingProposal
                  ? t('updatePrice')
                  : t('submitProposal')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
