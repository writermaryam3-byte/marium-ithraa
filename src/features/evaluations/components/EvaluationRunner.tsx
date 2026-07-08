'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast } from '@/lib/toast/app-toast'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import Timer from './Timer'
import SubmitModal from './SubmitModal'
import QuestionCard from './QuestionCard'
import { useEvaluationSession } from '@/features/evaluations/hooks/useEvaluationSession'

export default function EvaluationRunner({ attemptId }: { attemptId: string }) {
  const t = useTranslations('evaluations')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const session = useEvaluationSession(attemptId, { autosaveMs: 1200 })

  const title = session.attempt?.evaluation?.title ?? t('evaluation')

  const sortedQuestions = useMemo(() => {
    return [...session.questionList].sort((a, b) => a.order - b.order)
  }, [session.questionList])

  const progressPct =
    sortedQuestions.length > 0 ? (session.answeredCount / sortedQuestions.length) * 100 : 0

  if (session.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!session.attempt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('attemptNotFound')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t('error')}</CardContent>
      </Card>
    )
  }

  const formDisabled = session.locked || session.isExpired

  return (
    <div className="space-y-4">
      {session.usesFormFallback && (
        <p className="text-xs text-muted-foreground rounded-md border bg-muted/50 px-3 py-2">
          {t('formFallbackNotice')}
        </p>
      )}
      {session.missingAnswerIds > 0 && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
          {t('missingAnswerIds', { count: session.missingAnswerIds })}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {t('progress', {
              answered: session.answeredCount,
              total: sortedQuestions.length,
            })}
          </p>
          <ProgressBar value={progressPct} className="mt-2 max-w-xs" />
        </div>
        <div className="flex items-center gap-2">
          <Timer remainingMs={session.remainingMs ?? null} />
          <Button
            variant="outline"
            onClick={() => void session.save()}
            disabled={formDisabled || session.saveMutation.isPending}
          >
            {session.saveMutation.isPending ? t('saving') : t('saveProgress')}
          </Button>
          <Button
            onClick={() => {
              if (!session.allAnswered) {
                showErrorToast(t, 'answerAllRequired')
                return
              }
              setConfirmOpen(true)
            }}
            disabled={formDisabled || session.submitMutation.isPending || !session.allAnswered}
          >
            {t('submitEvaluation')}
          </Button>
        </div>
      </div>

      {session.isExpired && !session.locked && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base">{t('timeExpired')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t('timeExpiredHint')}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sortedQuestions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('noQuestions')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {session.isError ? t('error') : t('loading')}
            </CardContent>
          </Card>
        ) : (
          sortedQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              index={idx}
              question={q}
              value={session.answers[q.id]}
              onChange={(selectedAnswerId) => session.setAnswer(q.id, selectedAnswerId)}
              disabled={formDisabled}
            />
          ))
        )}
      </div>

      <SubmitModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isSubmitting={session.submitMutation.isPending}
        onConfirm={async () => {
          if (!session.allAnswered) {
            showErrorToast(t, 'answerAllRequired')
            return
          }
          try {
            await session.submit()
            setConfirmOpen(false)
          } catch {
            showErrorToast(t, 'error')
          }
        }}
      />
    </div>
  )
}
