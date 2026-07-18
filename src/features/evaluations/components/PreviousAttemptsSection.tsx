'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { DataTablePagination } from '@/components/shared/data-table/DataTablePagination'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { EvaluationAttempt } from '@/features/evaluations/types'
import {
  formatAttemptDateTime,
  formatAttemptDuration,
  getAttemptHistoryActionLabelKey,
  getAttemptResultSummary,
  getAttemptStatusDisplay,
  paginateAttempts,
  resolveAttemptHistoryAction,
  sortAttemptsNewestFirst,
} from '@/features/evaluations/utils/attempt-history'
import { Link } from '@/i18n/navigation'

const PAGE_SIZE = 10

type Props = {
  attempts: EvaluationAttempt[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function PreviousAttemptsSection({
  attempts,
  isLoading = false,
  isError = false,
  onRetry,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('evaluations')
  const [page, setPage] = useState(1)

  const sortedAttempts = useMemo(() => sortAttemptsNewestFirst(attempts), [attempts])
  const paginated = useMemo(
    () => paginateAttempts(sortedAttempts, page, PAGE_SIZE),
    [page, sortedAttempts],
  )

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h3 className="font-medium">{t('previousAttempts')}</h3>
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="space-y-3">
        <h3 className="font-medium">{t('previousAttempts')}</h3>
        <ErrorCard
          message={t('attemptHistory.loadError')}
          retry={onRetry ? { label: t('retry'), onClick: onRetry } : undefined}
        />
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h3 className="font-medium">{t('previousAttempts')}</h3>

      {sortedAttempts.length === 0 ? (
        <EmptyState title={t('attemptHistory.empty')} />
      ) : (
        <>
          <div className="space-y-3">
            {paginated.items.map((attempt) => (
              <PreviousAttemptCard key={attempt.id} attempt={attempt} locale={locale} t={t} />
            ))}
          </div>

          {paginated.meta.totalPages > 1 && (
            <DataTablePagination meta={paginated.meta} onPageChange={setPage} />
          )}
        </>
      )}
    </section>
  )
}

function PreviousAttemptCard({
  attempt,
  locale,
  t,
}: {
  attempt: EvaluationAttempt
  locale: string
  t: ReturnType<typeof useTranslations>
}) {
  const action = resolveAttemptHistoryAction(attempt)
  const actionLabel = t(getAttemptHistoryActionLabelKey(action))
  const resultSummary = getAttemptResultSummary(attempt)
  const statusLabel = getAttemptStatusDisplay(attempt.status, t)
  const href = `/dashboards/parent/attempts/${attempt.id}`

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium">{attempt.evaluation?.title ?? attempt.evaluationId}</p>
            <p className="text-sm text-muted-foreground">
              {t('attemptHistory.attemptNumber', { number: attempt.attemptNumber })}
            </p>
          </div>
          <Badge variant="secondary">{statusLabel}</Badge>
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <HistoryField
            label={t('attemptHistory.startedAt')}
            value={formatAttemptDateTime(attempt.startedAt, locale)}
          />
          <HistoryField
            label={t('attemptHistory.submittedAt')}
            value={formatAttemptDateTime(attempt.submittedAt, locale)}
          />
          <HistoryField
            label={t('attemptHistory.duration')}
            value={formatAttemptDuration(attempt.startedAt, attempt.submittedAt, t)}
          />
          <HistoryField
            label={t('score')}
            value={attempt.score != null ? String(attempt.score) : '—'}
          />
          {resultSummary && (
            <HistoryField
              label={t('attemptHistory.resultSummary')}
              value={resultSummary}
              className="sm:col-span-2"
            />
          )}
        </dl>

        <div className="flex flex-wrap justify-end gap-2">
          {action === 'waitingApproval' ? (
            <>
              <Badge variant="outline">{actionLabel}</Badge>
              <Button asChild variant="outline" size="sm">
                <Link href={href}>{t('attemptHistory.viewDetails')}</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant={action === 'continue' ? 'default' : 'outline'} size="sm">
              <Link href={href}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryField({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
