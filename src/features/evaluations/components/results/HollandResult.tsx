'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getResultDimensions,
  isHollandDimensionSuitable,
} from '@/features/evaluations/utils/result-fields'

export function HollandResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('evaluations.results.holland')
  const hollandCode = result.hollandCode as string | undefined
  const totalLevel = result.totalLevel as string | undefined
  const dimensions = getResultDimensions(result)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Holland: </span>
            {hollandCode ?? '—'}
          </p>
          <p>
            <span className="text-muted-foreground">{t('totalLevel')}: </span>
            {totalLevel ?? '—'}
          </p>
        </CardContent>
      </Card>
      {dimensions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('interests')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {dimensions.map((d, index) => {
              const suitable = isHollandDimensionSuitable(d)
              return (
                <Badge
                  key={String(d.code ?? d.name ?? index)}
                  variant={suitable ? 'default' : 'outline'}
                >
                  {String(d.name ?? d.code ?? '—')}
                  {suitable != null && ` — ${suitable ? t('suitable') : t('notSuitable')}`}
                </Badge>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
