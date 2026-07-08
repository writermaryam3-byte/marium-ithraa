'use client'

import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

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
import { createChildAction, updateChildAction, type Child } from '@/features/children'
import { type ClassItem } from '@/features/classes'
import { type Grade } from '@/features/grades'
import { z } from 'zod'
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { createOrgChildSchema, updateChildSchema } from '@/features/forms/schemas/child.schema'
import { FormTypes, Gender, StatusCode } from '@/lib/types/enums'

type Props = {
  locale: string
  organizationId: string
  grades: Grade[]
  classes: ClassItem[]
  child?: Child
}

export function ChildFormScreen({ locale, organizationId, grades, classes, child }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const t = useTranslations('children.forms')
  const tCommon = useTranslations('common')
  const isEdit = Boolean(child)
  const action = isEdit ? updateChildAction : createChildAction
  const { fields: createFields } = useFormConfig(FormTypes.CHILD_ORG)
  const { fields: updateFields } = useFormConfig(FormTypes.CHILD_UPDATE)
  const [gradeFilter, setGradeFilter] = useState(child?.gradeId ?? child?.class?.gradeId ?? '')

  const defaultBirth =
    child?.birthDate && !Number.isNaN(new Date(child.birthDate).getTime())
      ? new Date(child.birthDate).toISOString().slice(0, 10)
      : ''

  const schema = isEdit ? updateChildSchema : createOrgChildSchema
  const defaultValues = isEdit
    ? {
        id: child!.id,
        name: child!.name,
        birthDate: defaultBirth,
        gender: (child!.gender as Gender) ?? Gender.MALE,
        classId: child!.classId ?? child!.class?.id ?? '',
      }
    : {
        organizationId,
        name: '',
        birthDate: '',
        gender: Gender.MALE,
        classId: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        parentPassword: '',
      }

  const { form, submit, isPending } = useServerActionForm({
    schema: schema as z.ZodType<any, any, any>,
    defaultValues: defaultValues as Record<string, unknown>,
    action,
    onStatusChange: (state) => {
      if (!state?.status) return
      if (state.status === StatusCode.CREATED || state.status === StatusCode.OK) {
        showSuccessToast(t, state.message ?? 'toast.saved')
        router.push('/dashboards/organization/children')
      } else if (state.message) showErrorToast(t, state.message)
    },
  })

  const classesForGrade = useMemo(() => {
    if (isEdit) return classes
    return classes.filter((c) => !gradeFilter || c.gradeId === gradeFilter)
  }, [classes, gradeFilter, isEdit])

  const pageTitle = isEdit ? t('editTitle') : t('addTitle')
  const parentFields = createFields.filter((f) =>
    ['parentName', 'parentEmail', 'parentPhone', 'parentPassword'].includes(f.name),
  )
  const baseFields = (isEdit ? updateFields : createFields).filter(
    (f) => !parentFields.some((p) => p.name === f.name),
  )

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
            <form
              onSubmit={form.handleSubmit((values) =>
                submit(values, isEdit ? {} : { organizationId }),
              )}
              className="space-y-5"
            >
              <RhfFormFields fields={baseFields} />

              {!isEdit && (
                <>
                  <p className="text-sm font-semibold text-muted-foreground pt-2">
                    {t('parentSection')}
                  </p>
                  <RhfFormFields fields={parentFields} />
                </>
              )}

              {!isEdit && (
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
              )}

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
                        <SelectItem value={Gender.MALE}>{t('gender.male')}</SelectItem>
                        <SelectItem value={Gender.FEMALE}>{t('gender.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('class.label')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEdit && !gradeFilter}
                    >
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
                  {isPending ? tCommon('saving') : tCommon('saveChanges')}
                </Button>
                <Button variant="outline" className="h-11 rounded-xl" asChild>
                  <Link href="/dashboards/organization/children">{tCommon('cancel')}</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
