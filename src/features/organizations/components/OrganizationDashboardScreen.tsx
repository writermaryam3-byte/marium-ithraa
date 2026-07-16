import * as React from 'react'
import { useTranslations } from 'next-intl'

import { WelcomeHero } from '@/components/shared/dashboard/WelcomeHero'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { ActivityFeed, type ActivityItem } from '@/components/shared/dashboard/ActivityFeed'
import type { StatCardProps } from '@/components/shared/dashboard/StatCard'

export type OrganizationDashboardScreenProps = {
  locale: string
  organizationName: string
  stats: StatCardProps[]
  activities: ActivityItem[]
}

export function OrganizationDashboardScreen({
  locale,
  organizationName,
  stats,
  activities,
}: OrganizationDashboardScreenProps) {
  const isAr = locale === 'ar'
  const t = useTranslations('organizations.dashboard')

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      <WelcomeHero
        title={t('welcome.title', { organizationName })}
        subtitle={t('welcome.subtitle')}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground text-start">{t('platformStats')}</h2>
        {stats.length > 0 ? (
          <StatsGrid items={stats} />
        ) : (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t('emptyStats')}
          </div>
        )}
      </section>

      {activities.length > 0 ? (
        <ActivityFeed title={t('recentActivity')} items={activities} />
      ) : (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground text-start">{t('recentActivity')}</h2>
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t('emptyActivity')}
          </div>
        </section>
      )}
    </main>
  )
}
