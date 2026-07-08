'use client'

import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
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
import { createClassAction, updateClassAction, type ClassItem } from '@/features/classes'
import { type Grade } from '@/features/grades'
import { type Teacher } from '@/features/teachers/types'
import { z } from 'zod'
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { createClassSchema, updateClassSchema } from '@/features/forms/schemas/class.schema'
import { FormTypes, StatusCode } from '@/lib/types/enums'

type Props = {
  locale: string
  organizationId: string
  grades: Grade[]
  teachers: Teacher[]
  defaultGradeId?: string
  classItem?: ClassItem
}

export function ClassFormScreen({ locale, grades, teachers, defaultGradeId, classItem }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const t = useTranslations('organizations.classes.forms')
  const tCommon = useTranslations('common')
  const { fields } = useFormConfig(FormTypes.CLASS)
  const isEdit = Boolean(classItem)
  const action = isEdit ? updateClassAction : createClassAction

  const schema = isEdit ? updateClassSchema : createClassSchema
  const defaultValues = isEdit
    ? {
        id: classItem!.id,
        name: classItem!.name,
        gradeId: classItem!.gradeId,
        teacherId: classItem!.teacherId ?? '',
      }
    : { name: '', gradeId: defaultGradeId ?? '', teacherId: '' }

  const { form, submit, isPending } = useServerActionForm({
    schema: schema as z.ZodType<any, any, any>,
    defaultValues: defaultValues as Record<string, unknown>,
    action,
    onStatusChange: (state) => {
      if (!state?.status) return
      if (state.status === StatusCode.CREATED || state.status === StatusCode.OK) {
        showSuccessToast(t, state.message ?? 'toast.saved')
        router.push('/dashboards/organization/classes')
      } else if (state.message) showErrorToast(t, state.message)
    },
  })

  const pageTitle = isEdit ? t('editTitle') : t('addTitle')

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: t('breadcrumb.home') },
          { href: '/dashboards/organization/classes', label: t('breadcrumb.classes') },
          { label: pageTitle },
        ]}
        title={pageTitle}
      />

      <Card className="mx-auto max-w-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => submit(values))} className="space-y-5">
              <RhfFormFields fields={fields} />
              <FormField
                control={form.control}
                name="gradeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('grade.label')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder={t('grade.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grades.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('teacher.label')}</FormLabel>
                    <Select
                      value={field.value || 'none'}
                      onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder={t('teacher.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t('teacher.none')}</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button
                  variant="gradient"
                  type="submit"
                  className="h-11 flex-1 rounded-xl"
                  disabled={isPending}
                >
                  {isPending ? tCommon('saving') : tCommon('saveChanges')}
                </Button>
                <Button variant="outline" className="h-11 rounded-xl" asChild>
                  <Link href="/dashboards/organization/classes">{tCommon('cancel')}</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
