import type { EvaluationQuestion, EvaluationQuestionAnswer } from '../types'

/** Parent-safe answer option (no scoreValue). */
export type ParentAnswerOption = {
  id: string
  text: string
}

/** Parent-safe question for rendering. */
export type ParentFormQuestion = {
  id: string
  content: string
  order: number
  answers: ParentAnswerOption[]
}

export function stripScoreValueFromAnswers(
  answers: EvaluationQuestionAnswer[] | undefined,
): ParentAnswerOption[] {
  return (answers ?? [])
    .filter((a): a is EvaluationQuestionAnswer & { id: string } => Boolean(a.id))
    .map(({ id, text }) => ({ id, text }))
}

export function toParentFormQuestions(
  questions: EvaluationQuestion[] | undefined,
): ParentFormQuestion[] {
  return (questions ?? []).map((q) => ({
    id: q.id,
    content: q.content,
    order: q.order ?? 0,
    answers: stripScoreValueFromAnswers(q.answers),
  }))
}

export function attemptHasRenderableQuestions(
  questions: EvaluationQuestion[] | undefined,
): boolean {
  const list = questions ?? []
  if (list.length === 0) return false
  return list.every(
    (q) =>
      q.answers?.length > 0 && q.answers.every((a) => Boolean(a.id) && typeof a.text === 'string'),
  )
}

export function countAnswersMissingIds(questions: EvaluationQuestion[] | undefined): number {
  let count = 0
  for (const q of questions ?? []) {
    for (const a of q.answers ?? []) {
      if (!a.id) count += 1
    }
  }
  return count
}

export function isEvaluationAttemptId(value: unknown): value is { id: string } {
  if (!value || typeof value !== 'object') return false
  const id = (value as { id?: unknown }).id
  return typeof id === 'string' && id.length > 0
}
