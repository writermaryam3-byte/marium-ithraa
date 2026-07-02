import type { AttemptAnswerPayload } from '../types'

/** Build save/submit payload; never includes answer text or scoreValue. */
export function buildAttemptAnswersPayload(answers: Record<string, string>): {
  answers: AttemptAnswerPayload[]
} {
  return {
    answers: Object.entries(answers).map(([questionId, selectedAnswerId]) => ({
      questionId,
      selectedAnswerId,
    })),
  }
}

/** Runtime guard: payload must not contain forbidden keys. */
export function assertParentAttemptPayload(payload: { answers?: AttemptAnswerPayload[] }): void {
  const raw = JSON.stringify(payload)
  if (raw.includes('"answer"') || raw.includes('"scoreValue"')) {
    throw new Error(
      'Invalid attempt payload: must use selectedAnswerId only, not answer or scoreValue',
    )
  }
  for (const entry of payload.answers ?? []) {
    if ('answer' in (entry as object) || 'scoreValue' in (entry as object)) {
      throw new Error('Invalid attempt answer entry: must use selectedAnswerId only')
    }
  }
}
