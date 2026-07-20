'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LearningStylesResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('evaluations.results.learningStyles')
  const dimensions =
    (result.dimensions as Array<{
      name?: string
      dominantPole?: string
      strength?: string | number
    }>) ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('dimensions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dimensions.map((d, i) => (
            <div key={i} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{d.name}</p>
              <p className="text-muted-foreground">
                {t('dominant')}: {d.dominantPole ?? '—'}
              </p>
              <p className="text-muted-foreground">
                {t('strength')}: {d.strength ?? '—'}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
