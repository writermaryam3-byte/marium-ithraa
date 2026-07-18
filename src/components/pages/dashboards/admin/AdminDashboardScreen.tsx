'use client'

import { Baby, Brain, ClipboardList, FileText, Send } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { ActivityFeed, type ActivityItem } from '@/components/shared/dashboard/ActivityFeed'
import { DashboardHomeLayout } from '@/components/shared/dashboard/DashboardHomeLayout'
import { QuickActionCard } from '@/components/shared/dashboard/QuickActionCard'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { WelcomeHero } from '@/components/shared/dashboard/WelcomeHero'
import { useAdminChildren } from '@/features/children'
import { useEvaluations } from '@/features/evaluations/hooks'
import { useNotificationsList } from '@/features/notifications/hooks'
import { resolveNotificationText } from '@/features/notifications/utils/resolveNotificationText'
import { Pages, Routes } from '@/lib/types/enums'
import { useSession } from 'next-auth/react'

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

export function AdminDashboardScreen() {
  const locale = useLocale()
  const tNav = useTranslations('navigation.dashboard')
  const tAdmin = useTranslations('dashboard.admin')
  const tCommon = useTranslations('common')
  const tNotif = useTranslations('notifications')
  const isAr = locale === 'ar'
  const { data: session } = useSession()

  const { data: childrenData, isLoading: loadingChildren } = useAdminChildren()
  const childrenCount = childrenData?.data?.length ?? 0
  const { data: evaluationsData, isLoading: loadingEvaluations } = useEvaluations()
  const evaluations = useMemo(
    () => (Array.isArray(evaluationsData) ? evaluationsData : []),
    [evaluationsData],
  )
  const { data: notificationsData } = useNotificationsList({ page: 1, limit: 5 })

  const displayName = session?.user?.name ?? tAdmin('defaultName')

  const stats = useMemo(
    () => [
      {
        label: tNav('children'),
        value: loadingChildren ? '-' : String(childrenCount),
        icon: <Baby />,
        variant: 'purple' as const,
      },
      {
        label: tNav('evaluations'),
        value: loadingEvaluations ? '-' : String(evaluations.length),
        icon: <Brain />,
        variant: 'violet' as const,
      },
      {
        label: tNotif('title'),
        value: String(notificationsData?.meta?.total ?? notificationsData?.items?.length ?? 0),
        icon: <FileText />,
        variant: 'indigo' as const,
      },
    ],
    [
      childrenCount,
      evaluations,
      notificationsData,
      loadingChildren,
      loadingEvaluations,
      tNav,
      tNotif,
    ],
  )

  const activities: ActivityItem[] = useMemo(() => {
    const items = notificationsData?.items ?? []
    if (items.length === 0) {
      return [
        {
          id: 'placeholder',
          title: tNotif('noRecentActivity'),
          timeAgo: '-',
          icon: <ClipboardList />,
        },
      ]
    }
    return items.slice(0, 4).map((n) => ({
      id: n.id,
      title: resolveNotificationText(n.title, tNotif, n.metadata),
      timeAgo: new Date(n.createdAt).toLocaleString(isAr ? 'ar-SA' : undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      icon: <FileText />,
    }))
  }, [notificationsData, isAr, tNotif])

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero
        title={tAdmin('welcome', { name: displayName })}
        subtitle={tAdmin('subtitle')}
      />

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{tAdmin('platformStats')}</h2>
        <StatsGrid items={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{tAdmin('quickActions')}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            title={tNav('evaluations')}
            description={tAdmin('evaluationsDesc')}
            href={`${ADMIN_URL}/evaluations`}
            icon={<Brain />}
            actionLabel={tAdmin('open')}
          />
          <QuickActionCard
            title={tNav('attempts')}
            description={tAdmin('attemptsDesc')}
            href={`${ADMIN_URL}/attempts`}
            icon={<ClipboardList />}
            actionLabel={tCommon('buttons.open')}
          />
          <QuickActionCard
            title={tNotif('dispatchTitle')}
            description={tAdmin('dispatchDesc')}
            href={`${ADMIN_URL}/notifications/dispatch`}
            icon={<Send />}
            actionLabel={tAdmin('send')}
          />
        </div>
      </section>

      <ActivityFeed title={tAdmin('recentNotifications')} items={activities} />
    </DashboardHomeLayout>
  )
}
