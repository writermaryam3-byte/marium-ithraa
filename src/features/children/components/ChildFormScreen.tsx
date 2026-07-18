'use client'

import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useActionFeedback } from '@/hooks/useActionFeedback'
import { isActionSuccess } from '@/features/forms/action-results'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateChildAction, type Child } from '@/features/children'
import { type ClassItem } from '@/features/classes'
import { type Grade } from '@/features/grades'
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { updateChildSchema } from '@/features/forms/schemas/child.schema'
import { FormTypes, Gender } from '@/lib/types/enums'

type Props = {
  locale: string
  grades: Grade[]
  classes: ClassItem[]
  child: Child
}

export function ChildFormScreen({ locale, grades, classes, child }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const t = useTranslations('children.forms')
  const tCommon = useTranslations('common')
  const { notifyAction } = useActionFeedback()
  const { fields: updateFields } = useFormConfig(FormTypes.CHILD_UPDATE)
  const [gradeFilter, setGradeFilter] = useState(child.gradeId ?? child.class?.gradeId ?? '')

  const defaultBirth =
    child.birthDate && !Number.isNaN(new Date(child.birthDate).getTime())
      ? new Date(child.birthDate).toISOString().slice(0, 10)
      : ''

  const { form, submit, isPending } = useServerActionForm({
    schema: updateChildSchema,
    defaultValues: {
      id: child.id,
      name: child.name,
      birthDate: defaultBirth,
      gender: (child.gender as Gender) ?? Gender.MALE,
      classId: child.classId ?? child.class?.id ?? '',
    },
    action: updateChildAction,
    onStatusChange: (state) => {
      if (!state?.status) return
      if (isActionSuccess(state)) {
        notifyAction(state)
        router.push('/dashboards/organization/children')
      } else if (state.message) {
        notifyAction(state)
      }
    },
  })

  const classesForGrade = useMemo(() => {
    if (!gradeFilter) return classes
    return classes.filter((c) => c.gradeId === gradeFilter)
  }, [classes, gradeFilter])

  const pageTitle = t('editTitle')

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: t('breadcrumb.home') },
          { href: '/dashboards/organization/children', label: t('breadcrumb.children') },
          { label: pageTitle },
        ]}
        title={pageTitle}
        subtitle={t('subtitle')}
      />

      <Card className="mx-auto max-w-3xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => submit(values))} className="space-y-5">
              <RhfFormFields fields={updateFields} />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gender.label')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder={t('gender.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>{t('fields.genderOptions.male')}</SelectItem>
                        <SelectItem value={Gender.FEMALE}>{t('fields.genderOptions.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>{t('grade.label')}</FormLabel>
                <Select
                  value={gradeFilter}
                  onValueChange={(v) => {
                    setGradeFilter(v)
                    form.setValue('classId', '')
                  }}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder={t('grade.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('class.label')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder={t('class.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classesForGrade.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  variant="gradient"
                  type="submit"
                  className="h-11 flex-1 rounded-xl"
                  disabled={isPending}
                >
                  {isPending ? tCommon('states.saving') : tCommon('buttons.save')}
                </Button>
                <Button variant="outline" className="h-11 rounded-xl" asChild>
                  <Link href="/dashboards/organization/children">{tCommon('buttons.cancel')}</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
