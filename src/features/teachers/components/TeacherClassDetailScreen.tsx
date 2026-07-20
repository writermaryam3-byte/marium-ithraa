'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Baby, ClipboardCheck, Search, Users } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { ListFilters } from '@/components/shared/management/ListFilters'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type ClassItem } from '@/features/classes'
import { type Child } from '@/features/children'
import { formatChildBirthDate, getChildEvaluationLabel } from '@/features/children/utils/display'
import { getTextDirection } from '@/lib/i18n/locale-utils'

type Props = {
  classItem: ClassItem
  classChildren: Child[]
}

export function TeacherClassDetailScreen({ classItem, classChildren }: Props) {
  const locale = useLocale()
  const t = useTranslations('teachers.classroom')
  const tChildren = useTranslations('children')
  const tDash = useTranslations('teachers.dashboard')
  const tCommon = useTranslations('common')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return classChildren
    return classChildren.filter((child) => child.name.toLowerCase().includes(q))
  }, [classChildren, search])

  const evaluatedCount = classChildren.filter((c) => (c.attemptsUsed ?? 0) > 0).length

  return (
    <main className="app-container space-y-8 py-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/teacher', label: tCommon('general.home') },
          { href: '/dashboards/teacher/classes', label: tDash('classes') },
          { label: classItem.name },
        ]}
        title={classItem.name}
        subtitle={t('gradeSubtitle', { grade: classItem.gradeName ?? '—' })}
      />

      <StatsGrid
        items={[
          {
            label: tDash('childrenCount'),
            value: classChildren.length,
            icon: <Users />,
            variant: 'purple',
          },
          {
            label: t('evaluatedCount'),
            value: evaluatedCount,
            icon: <ClipboardCheck />,
            variant: 'violet',
          },
          {
            label: t('pendingCount'),
            value: Math.max(0, classChildren.length - evaluatedCount),
            icon: <Baby />,
            variant: 'pink',
          },
        ]}
      />

      <ListFilters
        locale={locale}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('searchChildren')}
      />

      {filtered.length === 0 ? (
        <EmptyState title={classChildren.length === 0 ? t('emptyClass') : t('noSearchResults')} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, tChildren)
            return (
              <Card key={child.id} className="rounded-2xl transition-shadow hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="size-4 text-fuchsia-600" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('birth')}: {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>{evalInfo.label}</p>
                  <Button variant="gradient" className="w-full rounded-xl" asChild>
                    <Link href={`/dashboards/teacher/children/${child.id}/evaluations?classId=${classItem.id}`}>
                      {t('viewEvaluations')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
    </main>
  )
}
