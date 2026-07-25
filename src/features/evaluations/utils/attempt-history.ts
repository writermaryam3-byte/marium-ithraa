import type { EvaluationAttempt } from '../types'
import { getDateLocale } from '@/lib/i18n/locale-utils'
import { getAttemptStatusLabel } from './labels'
import { isCompletedAttempt, isUnfinishedAttempt, normalizeAttemptStatus } from './evaluation-action'

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

export function formatAttemptDateTime(
  value: string | null | undefined,
  locale: string,
): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(getDateLocale(locale))
}

export function formatAttemptDuration(
  startedAt: string | undefined,
  submittedAt: string | null | undefined,
  t: TranslateFn,
): string {
  if (!startedAt) return '—'

  const startMs = Date.parse(startedAt)
  if (Number.isNaN(startMs)) return '—'

  const endMs = submittedAt ? Date.parse(submittedAt) : Date.now()
  if (Number.isNaN(endMs)) return '—'

  const totalMinutes = Math.max(0, Math.round((endMs - startMs) / 60_000))
  if (totalMinutes < 60) {
    return t('attemptHistory.durationMinutes', { count: totalMinutes })
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return t('attemptHistory.durationHoursMinutes', { hours, minutes })
}

export function getAttemptResultSummary(attempt: EvaluationAttempt): string | null {
  if (attempt.score != null && Number.isFinite(attempt.score)) {
    return String(attempt.score)
  }

  const result = attempt.result
  if (!result || typeof result !== 'object') return null

  const record = result as Record<string, unknown>
  const candidates = [
    record.topResultLabel,
    record.level,
    record.dominant,
    record.totalLevel,
    record.average,
  ]

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value
  }

  const top3 = record.top3 ?? record.dominantDimensions
  if (Array.isArray(top3) && top3.length > 0) {
    const first = top3[0] as Record<string, unknown>
    if (typeof first.name === 'string') return first.name
    if (typeof first.label === 'string') return first.label
  }

  return null
}

export type AttemptHistoryAction = 'continue' | 'viewResults' | 'viewDetails' | 'waitingApproval'

export function resolveAttemptHistoryAction(attempt: EvaluationAttempt): AttemptHistoryAction {
  const status = normalizeAttemptStatus(attempt.status)

  if (isUnfinishedAttempt(attempt)) return 'continue'
  if (status === 'approved') return 'viewResults'
  if (status === 'submitted') return 'waitingApproval'
  return 'viewDetails'
}

export function getAttemptHistoryActionLabelKey(action: AttemptHistoryAction): string {
  switch (action) {
    case 'continue':
      return 'continueAttempt'
    case 'viewResults':
      return 'viewResult'
    case 'waitingApproval':
      return 'waitingApproval'
    case 'viewDetails':
    default:
      return 'attemptHistory.viewDetails'
  }
}

export function getAttemptStatusDisplay(status: string, t: TranslateFn): string {
  return getAttemptStatusLabel(status, t)
}

export function sortAttemptsNewestFirst(attempts: EvaluationAttempt[]): EvaluationAttempt[] {
  return [...attempts].sort((a, b) => {
    const aTime = Date.parse(a.submittedAt ?? a.startedAt ?? '')
    const bTime = Date.parse(b.submittedAt ?? b.startedAt ?? '')
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
  })
}

export function paginateAttempts<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    meta: {
      page: safePage,
      limit: pageSize,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  }
}

export function isViewableAttempt(attempt: EvaluationAttempt): boolean {
  return isUnfinishedAttempt(attempt) || isCompletedAttempt(attempt)
}
