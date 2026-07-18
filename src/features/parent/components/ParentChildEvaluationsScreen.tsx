'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, Clock, CreditCard, Lock, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAvailableEvaluations,
  useChildAttempts,
  useChildEvaluationState,
  useInitiateExtraPayment,
  useOpenPrivateMainSlot,
  useRequestPrivateExtraAttempt,
  useRequestPrivateRetake,
  useStartEvaluation,
} from '@/features/evaluations/hooks'
import type { ChildEvaluationState, ExtraSlotStatus } from '@/features/evaluations/api'
import type { Evaluation, EvaluationAttempt } from '@/features/evaluations/types'
import {
  formatAgeRange,
  getAttemptStatusLabel,
  getEvaluationTypeLabel,
} from '@/features/evaluations/utils/labels'
import { cn } from '@/lib/utils'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'

type Props = {
  childId: string
}

export function ParentChildEvaluationsScreen({ childId }: Props) {
  const locale = useLocale()
  const t = useTranslations('evaluations')
  const tParent = useTranslations('dashboard.parent')
  const tCommon = useTranslations('common')

  const available = useAvailableEvaluations(childId)
  const attempts = useChildAttempts(childId)
  const state = useChildEvaluationState(childId)

  const age = available.data?.age
  const evaluations = available.data?.evaluations ?? []
  const childAttempts: EvaluationAttempt[] = Array.isArray(attempts.data) ? attempts.data : []

  const refetchAll = () => {
    void available.refetch()
    void attempts.refetch()
    void state.refetch()
  }

  if (available.isLoading || attempts.isLoading || state.isLoading) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (available.isError || attempts.isError || state.isError) {
    return (
      <div className="px-4 lg:px-6">
        <ErrorCard message={t('error')} retry={{ label: t('retry'), onClick: refetchAll }} />
      </div>
    )
  }

  const canStart = state.data?.hasReadySlot ?? false

  return (
    <div className="space-y-6 px-4 lg:px-6" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/parent', label: tCommon('general.home') },
          { href: '/dashboards/parent/children', label: tParent('children') },
          { label: t('childEvaluations') },
        ]}
        title={t('childEvaluations')}
        subtitle={age != null ? tParent('childAge', { age }) : undefined}
      />

      {state.data && <AttemptStatePanel childId={childId} state={state.data} t={t} />}

      <section className="space-y-3">
        <h3 className="font-medium">{t('availableEvaluations')}</h3>
        {evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          evaluations.map((ev) => (
            <AvailableEvaluationCard
              key={ev.id}
              evaluation={ev}
              childId={childId}
              childAttempts={childAttempts}
              canStart={canStart}
              t={t}
            />
          ))
        )}
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">{t('previousAttempts')}</h3>
        {childAttempts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          childAttempts.map((att) => <AttemptRow key={att.id} attempt={att} t={t} />)
        )}
      </section>
    </div>
  )
}

function AttemptStatePanel({
  childId,
  state,
  t,
}: {
  childId: string
  state: ChildEvaluationState
  t: ReturnType<typeof useTranslations>
}) {
  const mainSlot = useOpenPrivateMainSlot(childId)
  const retake = useRequestPrivateRetake(childId)
  const extra = useRequestPrivateExtraAttempt(childId)
  const [extraQty, setExtraQty] = useState(1)

  const runSlot = async (
    mutation: { mutateAsync: () => Promise<unknown> },
    successKey: string,
  ) => {
    try {
      await mutation.mutateAsync()
      showSuccessToast(t, successKey)
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  const requestExtra = async () => {
    try {
      await extra.mutateAsync(extraQty)
      showSuccessToast(t, 'attemptState.requestedToast')
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-base">{t('attemptState.title')}</CardTitle>
        <Badge
          variant={state.freeAttemptsRemaining > 0 ? 'default' : 'secondary'}
          className="whitespace-nowrap"
        >
          {state.freeAttemptsRemaining > 0
            ? t('attemptState.freeRemaining', { count: state.freeAttemptsRemaining })
            : t('attemptState.freeUsedAll')}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          {t('attemptState.usageSummary', {
            used: state.freeAttemptsUsed,
            limit: state.freeAttemptsLimit,
          })}
        </p>

        {state.hasReadySlot && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{t('attemptState.readyBanner')}</span>
          </div>
        )}

        {(state.canOpenMain || state.canRequestRetake) && (
          <div className="flex flex-wrap gap-2">
            {state.canOpenMain && (
              <Button disabled={mainSlot.isPending} onClick={() => runSlot(mainSlot, 'slotOpened')}>
                {t('attemptState.startFirst')}
              </Button>
            )}
            {state.canRequestRetake && (
              <Button
                variant="outline"
                disabled={retake.isPending}
                onClick={() => runSlot(retake, 'slotOpened')}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('attemptState.requestRetake')}
              </Button>
            )}
          </div>
        )}

        {state.canRequestExtra && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('attemptState.needAnotherTry')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border bg-background">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={extraQty <= 1}
                  onClick={() => setExtraQty((q) => Math.max(1, q - 1))}
                  aria-label={t('attemptState.decreaseQty')}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{extraQty}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={extraQty >= 10}
                  onClick={() => setExtraQty((q) => Math.min(10, q + 1))}
                  aria-label={t('attemptState.increaseQty')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button disabled={extra.isPending} onClick={requestExtra}>
                {t('attemptState.requestExtraCtaCount', { count: extraQty })}
              </Button>
            </div>
          </div>
        )}

        {state.extra && <ExtraAttemptStepper childId={childId} extra={state.extra} t={t} />}
      </CardContent>
    </Card>
  )
}

const EXTRA_STEP_INDEX: Record<ExtraSlotStatus, number> = {
  REQUESTED: 0,
  AWAITING_PAYMENT: 1,
  READY: 2,
  CONSUMED: 2,
  COMPLETED: 2,
}

function ExtraAttemptStepper({
  childId,
  extra,
  t,
}: {
  childId: string
  extra: NonNullable<ChildEvaluationState['extra']>
  t: ReturnType<typeof useTranslations>
}) {
  const pay = useInitiateExtraPayment(childId)
  const current = EXTRA_STEP_INDEX[extra.status] ?? 0
  const unlocked = current >= 2

  const steps = [
    { icon: Clock, label: t('attemptState.stepRequested'), hint: t('attemptState.stepRequestedHint') },
    { icon: CreditCard, label: t('attemptState.stepApproved'), hint: t('attemptState.stepApprovedHint') },
    { icon: Check, label: t('attemptState.stepUnlocked'), hint: t('attemptState.stepUnlockedHint') },
  ]

  const onPay = async () => {
    try {
      const res = await pay.mutateAsync(extra.slotId)
      if (res?.checkoutUrl) {
        window.open(res.checkoutUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-primary" />
        {t('attemptState.extraTitle')}
      </div>

      <ol className="flex items-start gap-2">
        {steps.map((step, idx) => {
          const StepIcon = step.icon
          const done = idx < current
          const active = idx === current
          return (
            <li key={idx} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span className={cn('h-0.5 flex-1', idx === 0 ? 'bg-transparent' : done || active ? 'bg-primary' : 'bg-border')} />
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors',
                    done && 'border-primary bg-primary text-primary-foreground',
                    active && !unlocked && 'border-primary bg-primary/10 text-primary',
                    active && unlocked && 'border-emerald-500 bg-emerald-500 text-white',
                    !done && !active && 'border-border bg-background text-muted-foreground',
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                </span>
                <span className={cn('h-0.5 flex-1', idx === steps.length - 1 ? 'bg-transparent' : done ? 'bg-primary' : 'bg-border')} />
              </div>
              <span className={cn('mt-2 text-xs font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>

      {extra.status === 'REQUESTED' && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          {t('attemptState.stepRequestedHint')}
        </p>
      )}

      {extra.status === 'AWAITING_PAYMENT' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{t('attemptState.stepApprovedHint')}</p>
          <Button disabled={pay.isPending} onClick={onPay}>
            <CreditCard className="mr-2 h-4 w-4" />
            {pay.isPending ? t('attemptState.openingPayment') : t('attemptState.payToUnlock')}
          </Button>
        </div>
      )}

      {unlocked && (
        <div className="flex flex-col items-center gap-2 py-2 text-center animate-in fade-in zoom-in duration-500">
          <SuccessBurst />
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {t('attemptState.unlockedTitle')}
          </p>
          <p className="text-xs text-muted-foreground">
            {extra.remaining > 1
              ? t('attemptState.unlockedDescCount', { count: extra.remaining })
              : t('attemptState.unlockedDesc')}
          </p>
        </div>
      )}
    </div>
  )
}

function SuccessBurst() {
  return (
    <span className="relative flex h-14 w-14 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
      <span className="absolute inline-flex h-10 w-10 rounded-full bg-emerald-500/20" />
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-in zoom-in duration-500">
        <Check className="h-6 w-6" strokeWidth={3} />
      </span>
    </span>
  )
}

function AvailableEvaluationCard({
  evaluation,
  childId,
  childAttempts,
  canStart,
  t,
}: {
  evaluation: Evaluation
  childId: string
  childAttempts: EvaluationAttempt[]
  canStart: boolean
  t: ReturnType<typeof useTranslations>
}) {
  const router = useRouter()
  const start = useStartEvaluation(evaluation.id)

  const inProgress = childAttempts.find(
    (a) => a.evaluationId === evaluation.id && a.status === 'in_progress',
  )

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-medium">{evaluation.title}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary">{getEvaluationTypeLabel(evaluation.type, t)}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatAgeRange(evaluation.ageFrom, evaluation.ageTo, t)}
            </span>
          </div>
        </div>
        {inProgress ? (
          <Button asChild>
            <Link href={`/dashboards/parent/attempts/${inProgress.id}`}>
              {t('continueAttempt')}
            </Link>
          </Button>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <Button
              disabled={start.isPending || !canStart}
              title={!canStart ? t('attemptState.startNeedsSlot') : undefined}
              onClick={async () => {
                try {
                  const attempt = await start.mutateAsync({ childId, childType: 'private' })
                  if (!attempt?.id) {
                    showErrorToast(t, 'error')
                    return
                  }
                  router.push(`/dashboards/parent/attempts/${attempt.id}`)
                } catch (e: unknown) {
                  showErrorToast({ error: e })
                }
              }}
            >
              {t('startEvaluation')}
            </Button>
            {!canStart && (
              <span className="text-[11px] text-muted-foreground">
                {t('attemptState.startNeedsSlot')}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AttemptRow({
  attempt,
  t,
}: {
  attempt: EvaluationAttempt
  t: ReturnType<typeof useTranslations>
}) {
  const status = attempt.status

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-medium">{attempt.evaluation?.title ?? attempt.evaluationId}</p>
          <p className="text-sm text-muted-foreground">
            #{attempt.attemptNumber} — {getAttemptStatusLabel(status, t)}
          </p>
        </div>
        {status === 'in_progress' && (
          <Button asChild>
            <Link href={`/dashboards/parent/attempts/${attempt.id}`}>{t('continueAttempt')}</Link>
          </Button>
        )}
        {status === 'submitted' && <Badge variant="secondary">{t('waitingApproval')}</Badge>}
        {status === 'approved' && (
          <Button asChild variant="outline">
            <Link href={`/dashboards/parent/attempts/${attempt.id}`}>{t('viewResult')}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
