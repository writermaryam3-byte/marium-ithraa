import type { EvaluationAttempt } from '../types'

export function getAttemptChildName(attempt: EvaluationAttempt): string | undefined {
  return (
    attempt.organizationChild?.name ??
    attempt.privateChild?.name ??
    attempt.child?.name ??
    undefined
  )
}

export function getAttemptParentLabel(attempt: EvaluationAttempt): string | undefined {
  const parent = attempt.parent
  if (!parent) return undefined

  return (
    parent.user?.name ??
    parent.user?.email ??
    parent.user?.phone ??
    undefined
  )
}
