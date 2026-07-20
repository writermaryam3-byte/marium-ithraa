'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ClipboardCheck, School, Users } from 'lucide-react'

import { EmptyState } from '@/components/shared/management/EmptyState'
import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClassItem } from '@/features/classes/types'
import { getTextDirection } from '@/lib/i18n/locale-utils'

type Props = {
  classes: ClassItem[]
  teacherName: string
}

export function TeacherClassesScreen({ classes, teacherName }: Props) {
  const locale = useLocale()
  const t = useTranslations('teachers.dashboard')
  const tClassroom = useTranslations('teachers.classroom')

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
          {classes.map((classItem) => {
            const childCount = classItem.childrenCount ?? classItem.children?.length ?? 0
            const evaluatedCount =
              classItem.evaluatedCount ??
              classItem.children?.filter((c) => (c.attemptsUsed ?? 0) > 0).length ??
              0

            return (
              <Card
                key={classItem.id}
                className="rounded-2xl transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <School className="size-5 text-primary" />
                    {classItem.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {classItem.gradeName ? (
                    <p>
                      {t('grade')}: {classItem.gradeName}
                    </p>
                  ) : null}
                  <p className="flex items-center gap-2">
                    <Users className="size-4" />
                    {t('childrenCount')}: {childCount}
                  </p>
                  <p className="flex items-center gap-2">
                    <ClipboardCheck className="size-4" />
                    {tClassroom('evaluatedCount')}: {evaluatedCount}
                  </p>
                  <Button variant="gradient" className="mt-2 w-full rounded-xl" asChild>
                    <Link href={`/dashboards/teacher/classes/${classItem.id}`}>{t('open')}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
