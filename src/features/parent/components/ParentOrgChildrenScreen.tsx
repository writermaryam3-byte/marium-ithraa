'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Baby, Calendar } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type Child } from '@/features/children'
import { formatChildBirthDate, getChildEvaluationLabel } from '@/features/children/utils/display'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'

type Props = {
  orgChildren: Child[]
}

export function ParentOrgChildrenScreen({ orgChildren }: Props) {
  const locale = useLocale()
  const t = useTranslations('dashboard.parent.orgChildren')
  const tParent = useTranslations('dashboard.parent')
  const tChildren = useTranslations('children')
  const tCommon = useTranslations('common')
  const tDashboard = useTranslations('common')

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/parent', label: tDashboard('home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {orgChildren.length === 0 ? (
        <EmptyState title={t('empty')} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {orgChildren.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, tChildren)
            return (
              <Card key={child.id} className="rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="text-fuchsia-600 size-4" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className="text-sm">
                    {tParent('attempts')}: {child.attemptsUsed ?? 0}
                  </p>
                  <p className="text-sm">
                    {tParent('retake')}: {child.retakeUsed ? tCommon('yes') : tCommon('no')}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>{evalInfo.label}</p>
                  <Button variant="outline" size="sm" className="mt-2 rounded-xl" asChild>
                    <Link href={`/dashboards/parent/children/${child.id}/evaluations`}>
                      {tParent('evaluationsLink')}
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
