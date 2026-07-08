'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createTeacherAction } from '@/features/teachers'
import { ServerActionForm } from '@/features/forms'
import { FormTypes, StatusCode } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

export function TeacherFormScreen({ locale }: { locale: string }) {
  const router = useRouter()
  const t = useTranslations('teachers.forms')
  const tCommon = useTranslations('common')
  const isAr = locale === 'ar'

  const handleStatus = (state: InitialState) => {
    if (state.status === StatusCode.CREATED) {
      showSuccessToast(t, state.message ?? 'toast.created')
      router.push('/dashboards/organization/teachers')
      return
    }
    if (state.status && state.message) {
      showErrorToast(t, state.message)
    }
  }

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: isAr ? 'الرئيسية' : 'Home' },
          { href: '/dashboards/organization/teachers', label: isAr ? 'المعلمين' : 'Teachers' },
          { label: t('pageTitle') },
        ]}
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
      />

      <Card className="mx-auto max-w-3xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{t('pageTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ServerActionForm
            formType={FormTypes.TEACHER}
            action={createTeacherAction}
            onStatusChange={handleStatus}
          >
            <Button variant="gradient" className="h-11 w-full rounded-xl" type="submit">
              {tCommon('add')}
            </Button>
          </ServerActionForm>
        </CardContent>
      </Card>
    </main>
  )
}
