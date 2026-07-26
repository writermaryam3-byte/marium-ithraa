'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentCompletePage() {
  const t = useTranslations('payments')
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  return (
    <main className="app-container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle>{t('completeTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('completeDescription')}</p>
          {ref && (
            <p className="text-xs text-muted-foreground">
              {t('reference')}: {ref}
            </p>
          )}
          <Button asChild className="w-full rounded-xl">
            <Link href="/dashboards/parent">{t('backToDashboard')}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
