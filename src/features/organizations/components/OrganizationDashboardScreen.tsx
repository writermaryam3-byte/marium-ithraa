'use client'

import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Baby,
  BookOpen,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Layers3,
  Plus,
  School,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import { ActivityFeed } from '@/components/shared/dashboard/ActivityFeed'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { WelcomeHero } from '@/components/shared/dashboard/WelcomeHero'
import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getOrganizationDashboardClient,
  type OrganizationDashboard,
} from '@/features/organizations/api'
import { getDateLocale } from '@/lib/i18n/locale-utils'

type Props = {
  organizationName: string
}

const ACTIVITY_ICONS: Record<string, ReactNode> = {
  Grade: <GraduationCap />,
  Class: <Layers3 />,
  Teacher: <UserRound />,
  OrganizationChild: <Baby />,
  Child: <Baby />,
  EvaluationAttempt: <ClipboardCheck />,
}

export function OrganizationDashboardScreen({ organizationName }: Props) {
  const locale = useLocale()
  const t = useTranslations('organizations.dashboard')
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['organization-dashboard'],
    queryFn: getOrganizationDashboardClient,
  })

  const displayName = data?.organizationName ?? organizationName

  if (isLoading) {
    return (
      <main className="app-container space-y-8 py-8">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="app-container py-8">
        <ErrorCard message={t('loadError')} retry={{ label: t('retry'), onClick: () => void refetch() }} />
      </main>
    )
  }

  const stats = buildStats(data, t)
  const activities = data.recentActivity.map((item) => ({
    id: item.id,
    title: t(item.titleKey as 'activity.childAdded', item.titleValues),
    timeAgo: formatRelativeTime(item.createdAt, locale, t),
    icon: ACTIVITY_ICONS[item.entityType] ?? <Sparkles />,
  }))

  return (
    <main className="app-container space-y-10 py-8">
      <WelcomeHero title={t('welcome.title', { organizationName: displayName })} subtitle={t('welcome.subtitle')} />

      <QuickActions t={t} />

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-start">{t('overview.title')}</h2>
        <StatsGrid items={stats} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardChartCard title={t('charts.childrenPerGrade')}>
          {data.charts.childrenPerGrade.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('charts.noData')}</p>
          ) : (
            <ul className="space-y-3">
              {data.charts.childrenPerGrade.map((row) => (
                <li key={row.gradeId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{row.gradeName}</span>
                    <span className="font-semibold tabular-nums">{row.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${Math.max(8, (row.count / Math.max(...data.charts.childrenPerGrade.map((g) => g.count), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardChartCard>

        <DashboardChartCard title={t('charts.evaluationCompletion')}>
          {data.charts.evaluationCompletionRate == null ? (
            <p className="text-sm text-muted-foreground">{t('charts.noEvaluations')}</p>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <span className="text-4xl font-bold tabular-nums text-primary">
                {data.charts.evaluationCompletionRate}%
              </span>
              <p className="text-sm text-muted-foreground">{t('charts.completionHint')}</p>
            </div>
          )}
        </DashboardChartCard>
      </section>

      {data.charts.monthlyActivity.length > 0 && (
        <DashboardChartCard title={t('charts.monthlyActivity')}>
          <div className="flex items-end gap-2 overflow-x-auto pb-2">
            {data.charts.monthlyActivity.map((row) => (
              <div key={row.month} className="flex min-w-14 flex-col items-center gap-2">
                <div
                  className="w-10 rounded-t-md bg-violet-500/80"
                  style={{
                    height: `${Math.max(12, row.count * 12)}px`,
                  }}
                  aria-hidden
                />
                <span className="text-[10px] text-muted-foreground">{row.month.slice(5)}</span>
              </div>
            ))}
          </div>
        </DashboardChartCard>
      )}

      {activities.length > 0 ? (
        <ActivityFeed title={t('recentActivity')} items={activities} />
      ) : (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-start">{t('recentActivity')}</h2>
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t('emptyActivity')}
          </div>
        </section>
      )}
    </main>
  )
}

function QuickActions({ t }: { t: ReturnType<typeof useTranslations> }) {
  const actions = [
    { href: '/dashboards/organization/children/new', label: t('quickActions.addChild'), icon: Baby },
    { href: '/dashboards/organization/teachers/new', label: t('quickActions.addTeacher'), icon: UserRound },
    { href: '/dashboards/organization/classes/new', label: t('quickActions.createClass'), icon: Layers3 },
    { href: '/dashboards/organization/grades/new', label: t('quickActions.createGrade'), icon: GraduationCap },
    { href: '/dashboards/organization/results', label: t('quickActions.assignEvaluation'), icon: BookOpen },
  ] as const

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-start">{t('quickActions.title')}</h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button key={action.href} asChild variant="outline" className="gap-2 rounded-xl">
              <Link href={action.href}>
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </section>
  )
}

function DashboardChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function buildStats(data: OrganizationDashboard, t: ReturnType<typeof useTranslations>) {
  const stats = [
    {
      label: t('stats.totalChildren'),
      value: data.totals.children,
      icon: <Baby />,
      variant: 'purple' as const,
    },
    {
      label: t('stats.totalTeachers'),
      value: data.totals.teachers,
      icon: <UserRound />,
      variant: 'violet' as const,
    },
    {
      label: t('stats.totalClasses'),
      value: data.totals.classes,
      icon: <Layers3 />,
      variant: 'pink' as const,
    },
    {
      label: t('stats.totalGrades'),
      value: data.totals.grades,
      icon: <GraduationCap />,
      variant: 'indigo' as const,
    },
    {
      label: t('stats.activeEvaluations'),
      value: data.evaluations.active,
      icon: <Clock3 />,
      variant: 'purple' as const,
    },
    {
      label: t('stats.completedEvaluations'),
      value: data.evaluations.completed,
      icon: <ClipboardCheck />,
      variant: 'violet' as const,
    },
    {
      label: t('stats.pendingEvaluations'),
      value: data.evaluations.pending,
      icon: <School />,
      variant: 'pink' as const,
    },
    {
      label: t('stats.subscriptionPlan'),
      value: t(`subscription.plans.${data.subscription.planId}.shortName`),
      icon: <Sparkles />,
      variant: 'indigo' as const,
    },
    {
      label: t('stats.subscriptionStatus'),
      value: t(data.subscription.statusKey as 'subscription.status.active'),
      icon: <Sparkles />,
      variant: 'purple' as const,
    },
  ]

  if (data.subscription.remainingDays != null) {
    stats.push({
      label: t('stats.remainingDays'),
      value: data.subscription.remainingDays,
      icon: <Clock3 />,
      variant: 'violet' as const,
    })
  }

  return stats
}

function formatRelativeTime(iso: string, locale: string, t: ReturnType<typeof useTranslations>) {
  const diffMs = Date.now() - Date.parse(iso)
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return t('activity.justNow')
  if (minutes < 60) return t('activity.minutesAgo', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('activity.hoursAgo', { count: hours })
  const days = Math.floor(hours / 24)
  if (days < 7) return t('activity.daysAgo', { count: days })
  return new Date(iso).toLocaleDateString(getDateLocale(locale))
}
