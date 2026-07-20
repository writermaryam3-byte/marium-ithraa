'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PrideResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('evaluations.results.pride')
  const total = result.totalScore ?? result.score
  const level = result.level as string | undefined
  const dimensions = (result.dimensions as Array<{ name?: string; score?: number }>) ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">{t('total')}: </span>
            {String(total ?? '—')}
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
            <CardTitle className="text-base">{t('breakdown')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dimensions.map((d, i) => (
              <p key={i} className="text-sm">
                {d.name}: {d.score ?? '—'}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
