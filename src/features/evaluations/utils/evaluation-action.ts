import type { EvaluationAttempt } from '../types'

export type EvaluationActionKind = 'continue' | 'start' | 'startNew' | 'blocked'

export type InProgressAttemptRef = {
  id: string
  evaluationId: string
  evaluationTitle?: string | null
}

export type EvaluationActionState = {
  kind: EvaluationActionKind
  attemptId?: string
  blockedReasonKey?: string
  enabled: boolean
}

const ORG_MAX_ATTEMPTS_PER_EVALUATION = 2

export function normalizeAttemptStatus(status?: string | null): string {
  return status?.toLowerCase?.().trim() ?? ''
}

export function isUnfinishedAttempt(attempt: EvaluationAttempt): boolean {
  return normalizeAttemptStatus(attempt.status) === 'in_progress'
}

export function isCompletedAttempt(attempt: EvaluationAttempt): boolean {
  const status = normalizeAttemptStatus(attempt.status)
  return status === 'submitted' || status === 'approved'
}

export function getAttemptsForEvaluation(
  attempts: EvaluationAttempt[],
  evaluationId: string,
): EvaluationAttempt[] {
  return attempts.filter((attempt) => attempt.evaluationId === evaluationId)
}

export function findUnfinishedAttemptForEvaluation(
  attempts: EvaluationAttempt[],
  evaluationId: string,
  inProgressRefs: InProgressAttemptRef[] = [],
): EvaluationAttempt | undefined {
  const fromList = getAttemptsForEvaluation(attempts, evaluationId).find(isUnfinishedAttempt)
  if (fromList) return fromList

  const ref = inProgressRefs.find((item) => item.evaluationId === evaluationId)
  if (!ref) return undefined

  return attempts.find((attempt) => attempt.id === ref.id)
}

export function findUnfinishedAttemptIdForEvaluation(
  attempts: EvaluationAttempt[],
  evaluationId: string,
  inProgressRefs: InProgressAttemptRef[] = [],
): string | undefined {
  return findUnfinishedAttemptForEvaluation(attempts, evaluationId, inProgressRefs)?.id ??
    inProgressRefs.find((item) => item.evaluationId === evaluationId)?.id
}

export function countCompletedAttemptsForEvaluation(
  attempts: EvaluationAttempt[],
  evaluationId: string,
): number {
  return getAttemptsForEvaluation(attempts, evaluationId).filter(isCompletedAttempt).length
}

export function hasAnyUnfinishedAttempt(
  attempts: EvaluationAttempt[],
  inProgressRefs: InProgressAttemptRef[] = [],
): boolean {
  return (
    attempts.some(isUnfinishedAttempt) ||
    inProgressRefs.length > 0 ||
    attempts.some((attempt) => inProgressRefs.some((ref) => ref.id === attempt.id))
  )
}

export function resolveEvaluationAction(input: {
  evaluationId: string
  childType: 'organization' | 'private'
  childAttempts: EvaluationAttempt[]
  hasReadySlot: boolean
  inProgressRefs?: InProgressAttemptRef[]
}): EvaluationActionState {
  const { evaluationId, childType, childAttempts, hasReadySlot, inProgressRefs = [] } = input
  const isPrivateChild = childType === 'private'

  const unfinishedId = findUnfinishedAttemptIdForEvaluation(
    childAttempts,
    evaluationId,
    inProgressRefs,
  )

  if (unfinishedId) {
    return {
      kind: 'continue',
      attemptId: unfinishedId,
      enabled: true,
    }
  }

  const completedCount = countCompletedAttemptsForEvaluation(childAttempts, evaluationId)

  if (!isPrivateChild && completedCount >= ORG_MAX_ATTEMPTS_PER_EVALUATION) {
    return {
      kind: 'blocked',
      blockedReasonKey: 'attemptActions.maxAttemptsReached',
      enabled: false,
    }
  }

  if (isPrivateChild && !hasReadySlot) {
    const blockedReasonKey = hasAnyUnfinishedAttempt(childAttempts, inProgressRefs)
      ? 'attemptActions.finishInProgressFirst'
      : 'attemptState.startNeedsSlot'

    return {
      kind: 'blocked',
      blockedReasonKey,
      enabled: false,
    }
  }

  if (completedCount > 0) {
    return {
      kind: 'startNew',
      enabled: true,
    }
  }

  return {
    kind: 'start',
    enabled: true,
  }
}

export function getEvaluationActionLabelKey(kind: EvaluationActionKind): string {
  switch (kind) {
    case 'continue':
      return 'continueAttempt'
    case 'startNew':
      return 'startNewAttempt'
    case 'start':
    case 'blocked':
    default:
      return 'startEvaluation'
  }
}
