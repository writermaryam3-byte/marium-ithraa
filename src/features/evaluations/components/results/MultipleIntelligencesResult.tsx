'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import {
  getDimensionPercentage,
  getResultDimensions,
  getTopDimensions,
} from '@/features/evaluations/utils/result-fields'

type DimScore = { code?: string; name?: string; score?: number; percentage?: number | null }

export function MultipleIntelligencesResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('evaluations.results.multipleIntelligences')
  const dimensions = getResultDimensions(result) as DimScore[]
  const top3 = getTopDimensions(result) as DimScore[]

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
          {dimensions.map((d, index) => {
            const score = d.score ?? 0
            const pct = getDimensionPercentage(d as Record<string, unknown>)
            return (
              <div key={d.code ?? index} className="space-y-1">
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
