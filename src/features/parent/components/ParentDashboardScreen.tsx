'use client'

import { Baby, Bell, Brain, FileText } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { ActivityFeed, type ActivityItem } from '@/components/shared/dashboard/ActivityFeed'
import { DashboardHomeLayout } from '@/components/shared/dashboard/DashboardHomeLayout'
import { QuickActionCard } from '@/components/shared/dashboard/QuickActionCard'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { WelcomeHero } from '@/components/shared/dashboard/WelcomeHero'
import { useNotificationsList, useUnreadCount } from '@/features/notifications/hooks'
import { getDateLocale } from '@/lib/i18n/locale-utils'
import { Pages, Routes } from '@/lib/types/enums'
import { useSession } from 'next-auth/react'

const PARENT_URL = `/${Routes.DASHBOARDS}/${Pages.PARENT}`

export function ParentDashboardScreen() {
  const locale = useLocale()
  const tParent = useTranslations('dashboard.parent')
  const tNotif = useTranslations('notifications')
  const { data: session } = useSession()

  const unread = useUnreadCount(30_000)
  const { data: notificationsData } = useNotificationsList({ page: 1, limit: 5 })

  const displayName = session?.user?.name ?? tParent('defaultName')
  const unreadCount = unread.data?.count ?? 0

  const stats = useMemo(
    () => [
      {
        label: tNotif('unread'),
        value: String(unreadCount),
        icon: <Bell />,
        variant: 'purple' as const,
      },
      {
        label: tNotif('title'),
        value: String(notificationsData?.items.meta?.total ?? 0),
        icon: <FileText />,
        variant: 'violet' as const,
      },
      {
        label: tParent('children'),
        value: '—',
        icon: <Baby />,
        variant: 'pink' as const,
      },
      {
        label: tParent('evaluations'),
        value: '—',
        icon: <Brain />,
        variant: 'indigo' as const,
      },
    ],
    [unreadCount, notificationsData, tNotif, tParent],
  )

  const activities: ActivityItem[] = useMemo(() => {
    const items = notificationsData?.items.data ?? []
    if (items.length === 0) {
      return [
        {
          id: 'empty',
          title: tNotif('empty'),
          timeAgo: '—',
          icon: <Bell />,
        },
      ]
    }
    console.log('items', items)
    return items.slice(0, 4).map((n) => ({
      id: n.id,
      title: n.title,
      timeAgo: new Date(n.createdAt).toLocaleString(getDateLocale(locale), {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      icon: <Bell />,
    }))
  }, [notificationsData, locale, tNotif])

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero
        title={tParent('welcome', { name: displayName })}
        subtitle={tParent('subtitle')}
      />

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{tParent('overview')}</h2>
        <StatsGrid items={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">{tParent('quickActions')}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            title={tParent('children')}
            description={tParent('childrenDesc')}
            href={`${PARENT_URL}/children`}
            icon={<Baby />}
            actionLabel={tParent('viewChildren')}
          />
          <QuickActionCard
            title={tParent('evaluations')}
            description={tParent('evaluationsDesc')}
            href={`${PARENT_URL}/evaluations`}
            icon={<Brain />}
            actionLabel={tParent('evaluations')}
          />
          <QuickActionCard
            title={tNotif('title')}
            description={tParent('notificationsDesc')}
            href={`/${Routes.DASHBOARDS}/notifications`}
            icon={<Bell />}
            actionLabel={tNotif('viewAll')}
          />
        </div>
      </section>

      <ActivityFeed title={tParent('recentNotifications')} items={activities} />
    </DashboardHomeLayout>
  )
}
