'use client'

import { FileText, Handshake } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { DashboardHomeLayout } from '@/components/shared/dashboard/DashboardHomeLayout'
import { QuickActionCard } from '@/components/shared/dashboard/QuickActionCard'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { WelcomeHero } from '@/components/shared/dashboard/WelcomeHero'
import { useEnricherDeals, useEnricherProposals } from '@/features/enricher'
import { useSession } from 'next-auth/react'
import { Pages, Routes } from '@/lib/types/enums'

const ENRICHER_URL = `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`

export default function EnricherDashboardPage() {
  const locale = useLocale()
  const t = useTranslations('deals.enricher')
  const { data: session } = useSession()
  const { data: dealsData } = useEnricherDeals()
  const { data: proposalsData } = useEnricherProposals()

  const deals = Array.isArray(dealsData) ? dealsData : []
  const proposals = Array.isArray(proposalsData) ? proposalsData : []

  const displayName = session?.user?.name ?? 'Enricher'

  const stats = useMemo(
    () => [
      {
        label: t('deals'),
        value: String(deals.length),
        icon: <Handshake />,
        variant: 'purple' as const,
      },
      {
        label: t('proposals'),
        value: String(proposals.length),
        icon: <FileText />,
        variant: 'violet' as const,
      },
    ],
    [deals, proposals, t],
  )

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero title={t('welcome', { name: displayName })} subtitle={t('subtitle')} />

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{t('overview')}</h2>
        <StatsGrid items={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{t('quickActions')}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            title={t('deals')}
            description={t('dealsDesc')}
            href={`${ENRICHER_URL}/${Pages.DEALS}`}
            icon={<Handshake />}
            actionLabel={t('viewDeals')}
          />
          <QuickActionCard
            title={t('proposals')}
            description={t('proposalsDesc')}
            href={`${ENRICHER_URL}/${Pages.PROPOSALS}`}
            icon={<FileText />}
            actionLabel={t('viewProposals')}
          />
        </div>
      </section>
    </DashboardHomeLayout>
  )
}
