'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EvaluationAttempt } from '@/features/evaluations/types'
import { getAttemptStatusLabel } from '@/features/evaluations/utils/labels'
import { getDateLocale } from '@/lib/i18n/locale-utils'

function statusBadge(status: string, t: ReturnType<typeof useTranslations>) {
  const s = status.toLowerCase()
  const label = getAttemptStatusLabel(status, t)
  const variant: 'default' | 'secondary' | 'outline' =
    s === 'approved' ? 'default' : s === 'submitted' ? 'secondary' : 'outline'
  return { variant, label }
}

export default function AttemptSummary({
  attempt,
}: {
  attempt: EvaluationAttempt
  locale?: string
}) {
  const locale = useLocale()
  const t = useTranslations('Features.Evaluations')
  const b = statusBadge(attempt.status ?? 'unknown', t)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t('attemptSummary')}</CardTitle>
        <Badge variant={b.variant} className={cn('capitalize')}>
          {b.label}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{t('evaluation')}</span>
          <span className="font-medium">{attempt.evaluation?.title ?? attempt.evaluationId}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{t('score')}</span>
          <span className="font-medium">{attempt.score ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{t('submittedAt')}</span>
          <span className="font-medium">
            {attempt.submittedAt
              ? new Date(attempt.submittedAt).toLocaleString(getDateLocale(locale))
              : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{t('attemptNumber')}</span>
          <span className="font-medium">{attempt.attemptNumber}</span>
        </div>
      </CardContent>
    </Card>
  )
}
