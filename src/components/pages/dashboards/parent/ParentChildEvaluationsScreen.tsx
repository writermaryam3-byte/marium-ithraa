'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAvailableEvaluations,
  useChildAttempts,
  useOpenPrivateMainSlot,
  useRequestPrivateExtraAttempt,
  useRequestPrivateRetake,
  useStartEvaluation,
} from '@/features/evaluations/hooks'
import type { Evaluation, EvaluationAttempt } from '@/features/evaluations/types'
import {
  formatAgeRange,
  getAttemptStatusLabel,
  getEvaluationTypeLabel,
} from '@/features/evaluations/utils/labels'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'

type Props = {
  childId: string
}

export function ParentChildEvaluationsScreen({ childId }: Props) {
  const locale = useLocale()
  const t = useTranslations('Features.Evaluations')
  const tParent = useTranslations('Dashboard.Parent')

  const available = useAvailableEvaluations(childId)
  const attempts = useChildAttempts(childId)
  const mainSlot = useOpenPrivateMainSlot(childId)
  const retake = useRequestPrivateRetake(childId)
  const extra = useRequestPrivateExtraAttempt(childId)

  const [slotReady, setSlotReady] = useState(false)

  const age = available.data?.age
  const evaluations = available.data?.evaluations ?? []
  const childAttempts = attempts.data?.attempts ?? []

  const openSlot = async (mutation: { mutateAsync: () => Promise<unknown> }) => {
    try {
      await mutation.mutateAsync()
      setSlotReady(true)
      showSuccessToast(t, 'slotOpened')
      void available.refetch()
      void attempts.refetch()
    } catch (e: unknown) {
      showErrorToast({ raw: e instanceof Error ? e.message : t('error') })
    }
  }

  if (available.isLoading || attempts.isLoading) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (available.isError || attempts.isError) {
    return <p className="px-4 text-sm text-destructive">{t('error')}</p>
  }

  return (
    <div className="space-y-6 px-4 lg:px-6" dir={getTextDirection(locale)}>
      <div>
        <h2 className="text-xl font-semibold">{t('childEvaluations')}</h2>
        {age != null && (
          <p className="text-sm text-muted-foreground">{tParent('childAge', { age })}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('privateSlots')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{t('privateSlotHint')}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={mainSlot.isPending}
              onClick={() => openSlot(mainSlot)}
            >
              {t('openMainSlot')}
            </Button>
            <Button variant="outline" disabled={retake.isPending} onClick={() => openSlot(retake)}>
              {t('requestRetake')}
            </Button>
            <Button
              variant="outline"
              disabled={extra.isPending}
              onClick={async () => {
                try {
                  await extra.mutateAsync()
                  showSuccessToast(t, 'savedSuccess')
                } catch (e: unknown) {
                  showErrorToast({ raw: e instanceof Error ? e.message : t('error') })
                }
              }}
            >
              {t('requestExtra')}
            </Button>
          </div>
          {slotReady && <p className="text-sm text-emerald-700">{t('slotOpenedPickEvaluation')}</p>}
        </CardContent>
      </Card>

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

function AvailableEvaluationCard({
  evaluation,
  childId,
  childAttempts,
  t,
}: {
  evaluation: Evaluation
  childId: string
  childAttempts: EvaluationAttempt[]
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
          <Button
            disabled={start.isPending}
            onClick={async () => {
              try {
                const attempt = await start.mutateAsync({ childId, childType: 'private' })
                if (!attempt?.id) {
                  showErrorToast(t, 'error')
                  return
                }
                router.push(`/dashboards/parent/attempts/${attempt.id}`)
              } catch (e: unknown) {
                showErrorToast({ raw: e instanceof Error ? e.message : t('error') })
              }
            }}
          >
            {t('startEvaluation')}
          </Button>
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
