'use client'

import { useLocale, useTranslations } from 'next-intl'
import { School, Users } from 'lucide-react'

import { EmptyState } from '@/components/shared/management/EmptyState'
import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClassItem } from '@/features/classes/types'
import { getTextDirection } from '@/lib/i18n/locale-utils'

type Props = {
  classes: ClassItem[]
  teacherName: string
}

export function TeacherClassesScreen({ classes, teacherName }: Props) {
  const locale = useLocale()
  const t = useTranslations('Features.TeacherDashboard')

  return (
    <main className="app-container space-y-8 py-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        title={t('classes')}
        subtitle={t('classesWelcome', { name: teacherName })}
        breadcrumbs={[{ href: '/dashboards/teacher', label: t('brand') }, { label: t('classes') }]}
      />

      {classes.length === 0 ? (
        <EmptyState
          title={t('noClasses')}
          illustration={<School className="size-12 text-muted-foreground" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <School className="size-5 text-primary" />
                  {classItem.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {classItem.gradeName ? (
                  <p>
                    {t('grade')}: {classItem.gradeName}
                  </p>
                ) : null}
                <p className="flex items-center gap-2">
                  <Users className="size-4" />
                  {t('childrenCount')}: {classItem.childrenCount ?? classItem.children?.length ?? 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
