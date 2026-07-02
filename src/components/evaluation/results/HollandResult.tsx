'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function HollandResult({ result }: { result: Record<string, unknown> }) {
  const t = useTranslations('Features.EvaluationResults.holland')
  const hollandCode = result.hollandCode as string | undefined
  const totalLevel = result.totalLevel as string | undefined
  const dimensions =
    (result.dimensions as Array<{
      code?: string
      name?: string
      suitable?: boolean
    }>) ?? []

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
            {dimensions.map((d) => (
              <Badge key={d.code ?? d.name} variant={d.suitable ? 'default' : 'outline'}>
                {d.name ?? d.code}
                {d.suitable != null && ` — ${d.suitable ? t('suitable') : t('notSuitable')}`}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
