import * as React from 'react'
import { useTranslations } from 'next-intl'

import {
  Users,
  School,
  UserRound,
  Percent,
  UserPlus,
  UserRoundPlus,
  LayoutGrid,
  BarChart3,
} from 'lucide-react'

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
  const t = useTranslations('OrgDashboard')

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      <WelcomeHero
        title={t('welcome.title', { organizationName })}
        subtitle={t('welcome.subtitle')}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground text-start">{t('platformStats')}</h2>
        <StatsGrid items={stats} />
      </section>

      <ActivityFeed title={t('recentActivity')} items={activities} />
    </main>
  )
}

export function getOrganizationDashboardMockData(locale: string) {
  const isAr = locale === 'ar'

  const stats: StatCardProps[] = [
    {
      label: isAr ? 'نسبة التقييم' : 'Evaluation rate',
      value: isAr ? '70%' : '70%',
      icon: <Percent />,
      variant: 'purple',
    },
    {
      label: isAr ? 'الأطفال' : 'Children',
      value: isAr ? '120' : '120',
      icon: <Users />,
      variant: 'violet',
    },
    {
      label: isAr ? 'الفصول' : 'Classes',
      value: isAr ? '5' : '5',
      icon: <LayoutGrid />,
      variant: 'pink',
    },
    {
      label: isAr ? 'المعلمين' : 'Teachers',
      value: isAr ? '10' : '10',
      icon: <School />,
      variant: 'indigo',
    },
  ]

  const activities: ActivityItem[] = [
    {
      id: 'a1',
      title: isAr ? 'تم إضافة طفل جديد: يوسف محمد' : 'New child added: يوسف محمد',
      timeAgo: isAr ? 'منذ 5 دقائق' : '5 min ago',
      icon: <UserRoundPlus />,
    },
    {
      id: 'a2',
      title: isAr ? 'تم إضافة معلم جديد: سارة أحمد' : 'New teacher added: سارة أحمد',
      timeAgo: isAr ? 'منذ ساعة' : '1 hour ago',
      icon: <UserPlus />,
    },
    {
      id: 'a3',
      title: isAr ? 'تم إضافة فصل جديد: الروضة ب' : 'New class added: الروضة ب',
      timeAgo: isAr ? 'منذ 3 ساعات' : '3 hours ago',
      icon: <BarChart3 />,
    },
    {
      id: 'a4',
      title: isAr ? 'تم التقييم: علي خالد' : 'Evaluation completed: علي خالد',
      timeAgo: isAr ? 'منذ ساعتين' : '2 hours ago',
      icon: <UserRound />,
    },
  ]

  return { stats, activities }
}
