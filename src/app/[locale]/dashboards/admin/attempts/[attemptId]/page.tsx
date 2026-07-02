'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import AttemptSummary from '@/components/evaluation/AttemptSummary'
import { AttemptResultView } from '@/components/evaluation/results/AttemptResultView'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useApproveAttempt, useAttempt } from '@/features/evaluations/hooks'

export default function AdminAttemptDetailPage() {
  const params = useParams<{ attemptId: string }>()
  const attemptId = params.attemptId
  const locale = useLocale()
  const t = useTranslations('Features.Evaluations')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: attempt, isLoading } = useAttempt(attemptId)
  const approve = useApproveAttempt(attemptId)

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

  const canApprove = attempt.status === 'submitted'

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <AttemptSummary attempt={attempt} locale={locale} />

      {canApprove && (
        <div className="flex justify-end">
          <Button onClick={() => setConfirmOpen(true)} disabled={approve.isPending}>
            {approve.isPending ? t('saving') : t('approveAttempt')}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('result')}</CardTitle>
        </CardHeader>
        <CardContent>
          <AttemptResultView
            type={attempt.evaluation?.type ?? 'multiple_intelligences'}
            result={attempt.result}
          />
        </CardContent>
      </Card>

      {attempt.answers && attempt.answers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('answers')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {attempt.answers.map((a) => (
              <p key={a.id}>
                {a.questionId}: {a.selectedAnswer?.text ?? a.selectedAnswerId}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('approveAttempt')}</DialogTitle>
            <DialogDescription>{t('approveConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t('cancel')}
            </Button>
            <Button
              onClick={async () => {
                try {
                  await approve.mutateAsync()
                  showSuccessToast(t, 'approveSuccess')
                  setConfirmOpen(false)
                } catch (e: unknown) {
                  showErrorToast({ raw: e instanceof Error ? e.message : t('error') })
                }
              }}
              disabled={approve.isPending}
            >
              {t('approveAttempt')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
