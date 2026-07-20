'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

import AttemptSummary from '@/features/evaluations/components/AttemptSummary'
import EvaluationRunner from '@/features/evaluations/components/EvaluationRunner'
import { AttemptResultView } from '@/features/evaluations/components/results/AttemptResultView'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAttempt } from '@/features/evaluations/hooks'

type Props = {
  attemptId: string
}

export function EvaluationAttemptPageContent({ attemptId }: Props) {
  const locale = useLocale()
  const t = useTranslations('evaluations')
  const { data: attempt, isLoading } = useAttempt(attemptId)

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!attempt) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>{t('error')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t('attemptNotFound')}</CardContent>
      </Card>
    )
  }

  const status = attempt.status?.toLowerCase() ?? ''

  if (status === 'approved') {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-5 w-5" strokeWidth={3} />
          </span>
          <div>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              {t('resultReadyBadge')}
            </p>
            <p className="text-sm text-muted-foreground">{attempt.evaluation?.title}</p>
          </div>
        </div>
        <AttemptSummary attempt={attempt} locale={locale} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('result')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AttemptResultView
              type={attempt.evaluation?.type ?? 'multiple_intelligences'}
              result={attempt.result}
              title={attempt.evaluation?.title}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'submitted') {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <AttemptSummary attempt={attempt} locale={locale} />
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t('waitingApproval')}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <AttemptSummary attempt={attempt} locale={locale} />
      <EvaluationRunner attemptId={attemptId} />
    </div>
  )
}
