'use client'

import { useLocale, useTranslations } from 'next-intl'
import { FileText } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useEnricherProposals } from '@/features/enricher'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Pages, Routes } from '@/lib/types/enums'

const ENRICHER_URL = `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`

export default function EnricherProposalsPage() {
  const locale = useLocale()
  const t = useTranslations('deals.enricher')
  const { data, isLoading, isError } = useEnricherProposals()
  const proposals = Array.isArray(data) ? data : []

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[{ href: ENRICHER_URL, label: t('brand') }, { label: t('proposals') }]}
        title={t('proposals')}
        subtitle={t('proposalsDesc')}
      />

      {isError ? (
        <p className="text-sm text-destructive">{t('loadError')}</p>
      ) : proposals.length === 0 ? (
        <EmptyState title={t('noProposals')} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="text-fuchsia-600 size-4" />
                  {proposal.deal?.activity?.name ?? t('proposal')}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('price')}: {proposal.price != null ? `${proposal.price}` : '—'}
                </p>
                <Badge
                  variant={
                    proposal.status === 'APPROVED'
                      ? 'default'
                      : proposal.status === 'SELECTED'
                        ? 'secondary'
                        : proposal.status === 'REJECTED'
                          ? 'destructive'
                          : 'outline'
                  }
                >
                  {proposal.status ?? 'PENDING'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
