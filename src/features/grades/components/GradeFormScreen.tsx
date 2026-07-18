'use client'

import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useActionFeedback } from '@/hooks/useActionFeedback'
import { isActionSuccess } from '@/features/forms/action-results'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { createGradeAction, updateGradeAction, type Grade } from '@/features/grades'
import { z } from 'zod'
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { createGradeSchema, updateGradeSchema } from '@/features/forms/schemas/grade.schema'
import { FormTypes } from '@/lib/types/enums'

type Props = {
  locale: string
  organizationId: string
  grade?: Grade
}

export function GradeFormScreen({ locale, organizationId, grade }: Props) {
  const isAr = locale === 'ar'
  const router = useRouter()
  const t = useTranslations('organizations.grades.forms')
  const tCommon = useTranslations('common')
  const isEdit = Boolean(grade)
  const action = isEdit ? updateGradeAction : createGradeAction
  const { notifyAction } = useActionFeedback()
  const { fields } = useFormConfig(FormTypes.GRADE)

  const schema = isEdit ? updateGradeSchema : createGradeSchema
  const defaultValues = isEdit ? { id: grade!.id, name: grade!.name } : { name: '', organizationId }

  const { form, submit, isPending } = useServerActionForm({
    schema: schema as z.ZodType<any, any, any>,
    defaultValues: defaultValues as Record<string, unknown>,
    action,
    onStatusChange: (state) => {
      if (!state?.status) return
      if (isActionSuccess(state)) {
        notifyAction(state)
        router.push('/dashboards/organization/grades')
      } else if (state.message) {
        notifyAction(state)
      }
    },
  })

  const pageTitle = isEdit ? t('editTitle') : t('addTitle')

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: t('breadcrumb.home') },
          { href: '/dashboards/organization/grades', label: t('breadcrumb.grades') },
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
            <form
              onSubmit={form.handleSubmit((values) =>
                submit(values, isEdit ? {} : { organizationId }),
              )}
              className="space-y-5"
            >
              <RhfFormFields fields={fields} />
              <div className="flex gap-3">
                <Button
                  variant="gradient"
                  type="submit"
                  className="h-11 flex-1 rounded-xl"
                  disabled={isPending}
                >
                  {isPending ? tCommon('states.saving') : tCommon('buttons.save')}
                </Button>
                <Button variant="outline" className="h-11 rounded-xl" asChild>
                  <Link href="/dashboards/organization/grades">{tCommon('buttons.cancel')}</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
