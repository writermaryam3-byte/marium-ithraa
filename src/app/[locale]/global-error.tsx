'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('GlobalError')
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md border-amber-50 shadow-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">{t('title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">{t('description')}</p>
              {process.env.NODE_ENV === 'development' && (
                <div className="rounded-md bg-destructive/10 p-3 text-start text-sm text-destructive">
                  <p className="font-semibold">{t('errorDetails')}</p>
                  <p>{error.message}</p>
                  {error.stack && (
                    <pre className="mt-2 max-h-32 overflow-auto text-xs">{error.stack}</pre>
                  )}
                </div>
              )}
              <Button onClick={() => reset()} className="w-full">
                {t('tryAgain')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
