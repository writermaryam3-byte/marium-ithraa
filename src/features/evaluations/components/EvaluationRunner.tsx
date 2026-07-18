'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { showErrorToast } from '@/lib/toast/app-toast'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import Timer from './Timer'
import SubmitModal from './SubmitModal'
import QuestionCard from './QuestionCard'
import { useEvaluationSession } from '@/features/evaluations/hooks/useEvaluationSession'
import {
  getQuestionPageSize,
  readStoredQuestionPage,
  storeQuestionPage,
} from '@/features/evaluations/utils/question-pagination'

export default function EvaluationRunner({ attemptId }: { attemptId: string }) {
  const t = useTranslations('evaluations')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const session = useEvaluationSession(attemptId, { autosaveMs: 1200 })

  const title = session.attempt?.evaluation?.title ?? t('evaluation')

  const sortedQuestions = useMemo(() => {
    return [...session.questionList].sort((a, b) => a.order - b.order)
  }, [session.questionList])

  const pageSize = getQuestionPageSize()
  const totalPages = Math.max(1, Math.ceil(sortedQuestions.length / pageSize))
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (sortedQuestions.length === 0) {
      setCurrentPage(1)
      return
    }
    setCurrentPage(readStoredQuestionPage(attemptId, totalPages))
  }, [attemptId, sortedQuestions.length, totalPages])

  useEffect(() => {
    storeQuestionPage(attemptId, currentPage)
  }, [attemptId, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pageStart = (currentPage - 1) * pageSize
  const visibleQuestions = sortedQuestions.slice(pageStart, pageStart + pageSize)

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

  // Zero-waiting state: as soon as the attempt is submitted we show a calculating
  // screen and let React Query swap in the results dashboard once the (now
  // auto-approved) attempt refetches — no page refresh required.
  if (session.submitMutation.isPending || session.submitMutation.isSuccess) {
    return <CalculatingResults t={t} />
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
          <>
            {visibleQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                index={pageStart + idx}
                question={q}
                value={session.answers[q.id]}
                onChange={(selectedAnswerId) => session.setAnswer(q.id, selectedAnswerId)}
                disabled={formDisabled}
              />
            ))}

            {sortedQuestions.length > pageSize && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  {t('pagination.pageIndicator', { current: currentPage, total: totalPages })}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    {t('pagination.previous')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              </div>
            )}
          </>
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

function CalculatingResults({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <Card className="border-primary/20">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-in fade-in duration-500">
        <span className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/25" />
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-primary/10" />
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </span>
        </span>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{t('calculating.title')}</p>
          <p className="text-sm text-muted-foreground">{t('calculating.hint')}</p>
        </div>
      </CardContent>
    </Card>
  )
}
