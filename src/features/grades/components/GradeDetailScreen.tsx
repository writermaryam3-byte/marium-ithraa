'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Layers3, Plus } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { type Grade } from '@/features/grades'
import { type Child } from '@/features/children'
import { getTextDirection } from '@/lib/i18n/locale-utils'

type Props = {
  grade: Grade
  childrenByClass: Record<string, Child[]>
}

export function GradeDetailScreen({ grade, childrenByClass }: Props) {
  const locale = useLocale()
  const t = useTranslations('organizations.gradeDetail')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('navigation.organization')
  const classes = grade.classes ?? []

  return (
    <main className="app-container py-8 space-y-10" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: tCommon('home') },
          { href: '/dashboards/organization/grades', label: tNav('grades') },
          { label: grade.name },
        ]}
        title={grade.name}
        subtitle={t('subtitle', { count: classes.length })}
        action={{
          label: t('addClass'),
          href: `/dashboards/organization/classes/new?gradeId=${grade.id}`,
          icon: <Plus />,
        }}
      />

      {classes.length === 0 ? (
        <EmptyState
          title={t('emptyClasses')}
          actionLabel={t('addClass')}
          actionHref={`/dashboards/organization/classes/new?gradeId=${grade.id}`}
        />
      ) : (
        <div className="space-y-10">
          {classes.map((cls) => {
            const kids = childrenByClass[cls.id] ?? cls.children ?? []
            return (
              <section key={cls.id} className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Layers3 className="size-5 text-fuchsia-600" />
                    <Link
                      href={`/dashboards/organization/classes/${cls.id}`}
                      className="hover:text-fuchsia-600"
                    >
                      {cls.name}
                    </Link>
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {t('childrenCount', { count: kids.length })}
                  </span>
                </div>

                {kids.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('emptyChildren')}</p>
                ) : (
                  <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {kids.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/dashboards/organization/children/${child.id}`}
                          className="block rounded-xl border px-4 py-3 text-sm hover:bg-muted/50"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
