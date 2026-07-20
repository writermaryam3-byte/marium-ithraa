'use client'

import { useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { showErrorToast } from '@/lib/toast/app-toast'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EvaluationActionButton } from '@/features/evaluations/components/EvaluationActionButton'
import { PreviousAttemptsSection } from '@/features/evaluations/components/PreviousAttemptsSection'
import {
  useAvailableEvaluations,
  useChildAttempts,
  useStartEvaluation,
} from '@/features/evaluations/hooks'
import type { Evaluation, EvaluationAttempt } from '@/features/evaluations/types'
import { formatAgeRange, getEvaluationTypeLabel } from '@/features/evaluations/utils/labels'
import {
  findUnfinishedAttemptIdForEvaluation,
  resolveEvaluationAction,
} from '@/features/evaluations/utils/evaluation-action'
import { getTextDirection } from '@/lib/i18n/locale-utils'

const ATTEMPT_BASE = '/dashboards/teacher/attempts'

type Props = {
  childId: string
  classId?: string
}

export function TeacherChildEvaluationsScreen({ childId, classId }: Props) {
  const locale = useLocale()
  const t = useTranslations('evaluations')
  const tTeacher = useTranslations('teachers.classroom')
  const tCommon = useTranslations('common')
  const tDash = useTranslations('teachers.dashboard')

  const available = useAvailableEvaluations(childId)
  const attempts = useChildAttempts(childId, { limit: 100 })

  const age = available.data?.age
  const evaluations = available.data?.evaluations ?? []
  const childAttempts = attempts.data?.items ?? []

  const inProgressRefs = childAttempts
    .filter((a) => a.status?.toLowerCase() === 'in_progress')
    .map((a) => ({
      id: a.id,
      evaluationId: a.evaluationId,
      evaluationTitle: a.evaluation?.title ?? null,
    }))

  const refetchAll = () => {
    void available.refetch()
    void attempts.refetch()
  }

  if (available.isLoading || attempts.isLoading) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (available.isError) {
    return (
      <div className="px-4 lg:px-6">
        <ErrorCard message={t('error')} retry={{ label: t('retry'), onClick: refetchAll }} />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 lg:px-6" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/teacher', label: tCommon('general.home') },
          { href: '/dashboards/teacher/classes', label: tDash('classes') },
          ...(classId
            ? [{ href: `/dashboards/teacher/classes/${classId}`, label: tTeacher('class') }]
            : []),
          { label: t('childEvaluations') },
        ]}
        title={t('childEvaluations')}
        subtitle={age != null ? tTeacher('childAge', { age }) : undefined}
      />

      <section className="space-y-3">
        <h3 className="font-medium">{t('availableEvaluations')}</h3>
        {evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          evaluations.map((ev) => (
            <StaffEvaluationCard
              key={ev.id}
              evaluation={ev}
              childId={childId}
              childAttempts={childAttempts}
              inProgressRefs={inProgressRefs}
              t={t}
            />
          ))
        )}
      </section>

      <PreviousAttemptsSection attempts={childAttempts} attemptBasePath={ATTEMPT_BASE} />
    </div>
  )
}

function StaffEvaluationCard({
  evaluation,
  childId,
  childAttempts,
  inProgressRefs,
  t,
}: {
  evaluation: Evaluation
  childId: string
  childAttempts: EvaluationAttempt[]
  inProgressRefs: Array<{ id: string; evaluationId: string; evaluationTitle?: string | null }>
  t: ReturnType<typeof useTranslations>
}) {
  const router = useRouter()
  const start = useStartEvaluation(evaluation.id)

  const action = resolveEvaluationAction({
    evaluationId: evaluation.id,
    childType: 'organization',
    childAttempts,
    hasReadySlot: true,
    inProgressRefs,
  })

  const handleStart = async () => {
    if (!action.enabled || action.kind === 'continue' || action.kind === 'blocked') return

    try {
      const attempt = await start.mutateAsync({ childId, childType: 'organization' })
      if (!attempt?.id) {
        showErrorToast({ t, message: 'error' })
        return
      }
      router.push(`${ATTEMPT_BASE}/${attempt.id}`)
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  const continueId =
    action.kind === 'continue' && action.attemptId
      ? action.attemptId
      : findUnfinishedAttemptIdForEvaluation(childAttempts, evaluation.id, inProgressRefs)

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-medium">{evaluation.title}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge variant="secondary">{getEvaluationTypeLabel(evaluation.type, t)}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatAgeRange(evaluation.ageFrom, evaluation.ageTo, t)}
            </span>
          </div>
        </div>

        {action.kind === 'continue' && continueId ? (
          <ButtonLink attemptId={continueId} label={t('continueEvaluation')} />
        ) : (
          <EvaluationActionButton
            action={action}
            isPending={start.isPending}
            onStart={() => void handleStart()}
          />
        )}
      </CardContent>
    </Card>
  )
}

function ButtonLink({ attemptId }: { attemptId: string; label: string }) {
  return (
    <EvaluationActionButton
      action={{ kind: 'continue', enabled: true, attemptId }}
      attemptHref={`${ATTEMPT_BASE}/${attemptId}`}
    />
  )
}
