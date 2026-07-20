'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors.page')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="text-muted-foreground">{t('description')}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
