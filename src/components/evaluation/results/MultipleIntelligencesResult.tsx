'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'

type DimScore = { code?: string; name?: string; score?: number; max?: number }

export function MultipleIntelligencesResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('Features.EvaluationResults.multipleIntelligences')
  const dimensions = (result.dimensions as DimScore[]) ?? []
  const top3 = (result.top3 as DimScore[]) ?? dimensions.slice(0, 3)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('top3')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {top3.map((d, i) => (
            <p key={d.code ?? i} className="text-sm font-medium">
              {i + 1}. {d.name ?? d.code} — {d.score ?? '—'}
            </p>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('dimensions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dimensions.map((d) => {
            const max = d.max ?? 100
            const score = d.score ?? 0
            const pct = max > 0 ? Math.min(100, (score / max) * 100) : 0
            return (
              <div key={d.code} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{d.name ?? d.code}</span>
                  <span>{score}</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
