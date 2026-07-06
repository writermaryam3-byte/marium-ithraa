'use client'

import { Bell, LayoutGrid, School } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { ActivityFeed, type ActivityItem } from '@/components/shared/dashboard/ActivityFeed'
import { DashboardHomeLayout } from '@/components/shared/dashboard/DashboardHomeLayout'
import { QuickActionCard } from '@/components/shared/dashboard/QuickActionCard'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { WelcomeHero } from '@/components/shared/dashboard/WelcomeHero'
import { Pages, Routes } from '@/lib/types/enums'
import { useSession } from 'next-auth/react'

const TEACHER_URL = `/${Routes.DASHBOARDS}/${Pages.TEACHER}`

type Props = {
  classCount?: number
  teacherName?: string
}

export function TeacherDashboardScreen({ classCount = 0, teacherName }: Props) {
  const locale = useLocale()
  const tTeacher = useTranslations('Features.TeacherDashboard')
  const tNav = useTranslations('Dashboard.Nav')
  const tNotif = useTranslations('Features.Notifications')
  const { data: session } = useSession()

  const displayName = teacherName ?? session?.user?.name ?? tTeacher('defaultName')

  const stats = [
    {
      label: tTeacher('classes'),
      value: String(classCount),
      icon: <School />,
      variant: 'purple' as const,
    },
    {
      label: tNav('analytics'),
      value: '—',
      icon: <LayoutGrid />,
      variant: 'violet' as const,
    },
    {
      label: tNotif('unread'),
      value: '—',
      icon: <Bell />,
      variant: 'pink' as const,
    },
  ]

  const activities: ActivityItem[] = [
    {
      id: '1',
      title: tTeacher('noActivity'),
      timeAgo: '—',
      icon: <School />,
    },
  ]

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero
        title={tTeacher('welcome', { name: displayName })}
        subtitle={tTeacher('subtitle')}
      />

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{tTeacher('statsTitle')}</h2>
        <StatsGrid items={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">
          {tTeacher('quickActionsTitle')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <QuickActionCard
            title={tTeacher('classes')}
            description={tTeacher('classesDescription')}
            href={`${TEACHER_URL}/classes`}
            icon={<School />}
            actionLabel={tTeacher('open')}
          />
          <QuickActionCard
            title={tNotif('title')}
            description={tTeacher('notificationsDescription')}
            href={`/${Routes.DASHBOARDS}/notifications`}
            icon={<Bell />}
            actionLabel={tTeacher('open')}
          />
        </div>
      </section>

      <ActivityFeed title={tTeacher('recentActivityTitle')} items={activities} />
    </DashboardHomeLayout>
  )
}
