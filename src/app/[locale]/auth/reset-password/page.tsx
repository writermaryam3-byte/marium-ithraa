'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { AuthPageShell } from '@/features/auth/components/AuthPageShell'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

function ResetPasswordContent() {
  const t = useTranslations('auth.resetPassword')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <AuthPageShell title={t('title')} backHref="/auth/login" backLabel={t('backToLogin')}>
        <div className="space-y-5">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {t('missingToken')}
          </div>
          <Button asChild variant="gradient" className="h-11 w-full rounded-xl">
            <Link href="/auth/forgot-password">{t('requestNewLink')}</Link>
          </Button>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell
      title={t('title')}
      backHref="/auth/login"
      backLabel={t('backToLogin')}
      sideTitle={t('side.title')}
      sideSubtitle={t('side.subtitle')}
    >
      <ResetPasswordForm token={token} />
    </AuthPageShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  )
}
