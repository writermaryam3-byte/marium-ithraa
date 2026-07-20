import { useTranslations } from 'next-intl'

import { AuthPageShell } from '@/features/auth/components/AuthPageShell'
import LoginForm from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  const t = useTranslations('auth.login')

  return (
    <AuthPageShell
      title={t('title')}
      sideTitle={t('side.title')}
      sideSubtitle={t('side.subtitle')}
    >
      <LoginForm />
    </AuthPageShell>
  )
}
