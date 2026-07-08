'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RenzulliResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('evaluations.results.renzulli')
  const average = result.average ?? result.avg
  const level = result.level as string | undefined
  const dimensions =
    (result.dimensions as Array<{ name?: string; average?: number; level?: string }>) ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">{t('average')}: </span>
            {String(average ?? '—')}
          </p>
          <p>
            <span className="text-muted-foreground">{t('level')}: </span>
            {level ?? '—'}
          </p>
        </CardContent>
      </Card>
      {dimensions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dimensions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dimensions.map((d, i) => (
              <p key={i} className="text-sm">
                {d.name}: {d.average ?? '—'} ({d.level ?? '—'})
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
