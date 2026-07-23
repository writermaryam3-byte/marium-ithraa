import { useTranslations } from 'next-intl'

import { AuthPageShell } from '@/features/auth/components/AuthPageShell'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword')

  return (
    <AuthPageShell
      title={t('title')}
      backHref="/auth/login"
      backLabel={t('backToLogin')}
      sideTitle={t('side.title')}
      sideSubtitle={t('side.subtitle')}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}
