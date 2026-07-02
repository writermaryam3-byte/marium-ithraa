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
import { Pages, Routes } from '@/lib/types/enums'
import { useSession } from 'next-auth/react'

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

export function AdminDashboardScreen() {
  const locale = useLocale()
  const tNav = useTranslations('Dashboard.Nav')
  const tNotif = useTranslations('Features.Notifications')
  const isAr = locale === 'ar'
  const { data: session } = useSession()

  const { data: childrenData, isLoading: loadingChildren } = useAdminChildren()
  const { data: evaluationsData, isLoading: loadingEvaluations } = useEvaluations()
  const evaluations = Array.isArray(evaluationsData) ? evaluationsData : []
  const { data: notificationsData } = useNotificationsList({ page: 1, limit: 5 })

  const displayName = session?.user?.name ?? (isAr ? 'Admin' : 'Admin')

  const stats = useMemo(
    () => [
      {
        label: tNav('children'),
        value: loadingChildren
          ? '-'
          : String(
              (childrenData?.organizationChildren?.length ?? 0) +
                (childrenData?.privateChildren?.length ?? 0),
            ),
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
        value: String(notificationsData?.meta?.total ?? notificationsData?.data?.length ?? 0),
        icon: <FileText />,
        variant: 'indigo' as const,
      },
    ],
    [
      childrenData,
      evaluations,
      notificationsData,
      loadingChildren,
      loadingEvaluations,
      tNav,
      tNotif,
    ],
  )

  const activities: ActivityItem[] = useMemo(() => {
    const items = notificationsData?.data ?? []
    if (items.length === 0) {
      return [
        {
          id: 'placeholder',
          title: isAr ? 'No recent activity' : 'No recent activity',
          timeAgo: '-',
          icon: <ClipboardList />,
        },
      ]
    }
    return items.slice(0, 4).map((n) => ({
      id: n.id,
      title: n.title,
      timeAgo: new Date(n.createdAt).toLocaleString(isAr ? 'ar-SA' : undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      icon: <FileText />,
    }))
  }, [notificationsData, isAr])

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero
        title={isAr ? `Welcome, ${displayName}` : `Welcome, ${displayName}`}
        subtitle={
          isAr
            ? 'Manage the platform, evaluations, and users from one place'
            : 'Manage the platform, evaluations, and users from one place'
        }
      />

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">
          {isAr ? 'Platform stats' : 'Platform stats'}
        </h2>
        <StatsGrid items={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">
          {isAr ? 'Quick actions' : 'Quick actions'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            title={tNav('evaluations')}
            description={isAr ? 'Create and manage evaluations' : 'Create and manage evaluations'}
            href={`${ADMIN_URL}/evaluations`}
            icon={<Brain />}
            actionLabel={isAr ? 'Open' : 'Open'}
          />
          <QuickActionCard
            title={tNav('attempts')}
            description={isAr ? 'Review and approve attempts' : 'Review and approve attempts'}
            href={`${ADMIN_URL}/attempts`}
            icon={<ClipboardList />}
            actionLabel={isAr ? 'Open' : 'Open'}
          />
          <QuickActionCard
            title={tNotif('dispatchTitle')}
            description={isAr ? 'Send a notification to a user' : 'Send a notification to a user'}
            href={`${ADMIN_URL}/notifications/dispatch`}
            icon={<Send />}
            actionLabel={isAr ? 'Send' : 'Send'}
          />
        </div>
      </section>

      <ActivityFeed
        title={isAr ? 'Recent notifications' : 'Recent notifications'}
        items={activities}
      />
    </DashboardHomeLayout>
  )
}
