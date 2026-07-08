'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import AttemptSummary from '@/components/evaluation/AttemptSummary'
import EvaluationRunner from '@/components/evaluation/EvaluationRunner'
import { AttemptResultView } from '@/components/evaluation/results/AttemptResultView'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAttempt } from '@/features/evaluations/hooks'

export default function ParentAttemptPage() {
  const params = useParams<{ attemptId: string }>()
  const attemptId = params.attemptId
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
