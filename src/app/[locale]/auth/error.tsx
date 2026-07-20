'use client'

import { useTranslations } from 'next-intl'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors.auth')
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
      <p className="text-muted-foreground">{t('description')}</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        {t('tryAgain')}
      </button>
    </div>
  )
}
