'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'
import { showErrorToast, showInfoToast, showSuccessToast } from '@/lib/toast/app-toast'

import type { EvaluationAttempt, SubmitAttemptDto } from '../types'
import {
  attemptHasRenderableQuestions,
  countAnswersMissingIds,
  toParentFormQuestions,
  type ParentFormQuestion,
} from '../utils/parent-form'
import { assertParentAttemptPayload, buildAttemptAnswersPayload } from '../utils/payload'
import { useAttempt, useEvaluationForm, useSaveAttemptProgress, useSubmitAttempt } from './index'

type AnswerMap = Record<string, string>

function isLocked(attempt: EvaluationAttempt | undefined) {
  const s = attempt?.status?.toLowerCase?.() ?? ''
  return s === 'submitted' || s === 'approved' || s === 'expired'
}

function msUntil(iso: string | null | undefined): number | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return null
  return t - Date.now()
}

export function useEvaluationSession(attemptId: string, options?: { autosaveMs?: number }) {
  const t = useTranslations('evaluations.session')
  const tb = useTranslateBackend()
  const autosaveMs = options?.autosaveMs ?? 1200
  const { data: attempt, isLoading, isError, error, refetch } = useAttempt(attemptId)
  const saveMutation = useSaveAttemptProgress(attemptId)
  const submitMutation = useSubmitAttempt(attemptId)

  const evaluationId = attempt?.evaluationId ?? ''
  const needsFormFallback =
    Boolean(attempt) && !attemptHasRenderableQuestions(attempt?.evaluation?.questions)

  const {
    data: formEvaluation,
    isLoading: isFormLoading,
    isError: isFormError,
  } = useEvaluationForm(evaluationId, {
    enabled: Boolean(evaluationId) && needsFormFallback,
  })

  const locked = useMemo(() => isLocked(attempt), [attempt])
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [dirty, setDirty] = useState(false)
  const [now, setNow] = useState(Date.now())
  const lastSavedRef = useRef<string>('')
  const autosaveTimer = useRef<number | null>(null)

  const questionList: ParentFormQuestion[] = useMemo(() => {
    if (!attempt) return []
    if (attemptHasRenderableQuestions(attempt.evaluation?.questions)) {
      return toParentFormQuestions(attempt.evaluation?.questions)
    }
    if (formEvaluation?.questions) {
      return toParentFormQuestions(formEvaluation.questions)
    }
    return []
  }, [attempt, formEvaluation?.questions])

  const usesFormFallback = needsFormFallback && Boolean(formEvaluation?.questions)

  const missingAnswerIds = useMemo(() => {
    const raw = attempt?.evaluation?.questions ?? formEvaluation?.questions ?? []
    return countAnswersMissingIds(raw)
  }, [attempt?.evaluation?.questions, formEvaluation?.questions])

  useEffect(() => {
    if (!attempt) return
    const initial: AnswerMap = {}
    for (const a of attempt.answers ?? []) {
      if (a.questionId && a.selectedAnswerId) {
        initial[a.questionId] = a.selectedAnswerId
      }
    }
    setAnswers(initial)
    lastSavedRef.current = JSON.stringify(initial)
    setDirty(false)
  }, [attempt])

  useEffect(() => {
    if (!attempt?.expiresAt || locked) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [attempt?.expiresAt, locked])

  const remainingMs = useMemo(() => msUntil(attempt?.expiresAt), [attempt?.expiresAt, now])
  const isExpired = remainingMs !== null && remainingMs <= 0

  const lockedRef = useRef(locked)
  lockedRef.current = locked
  const answersRef = useRef(answers)
  answersRef.current = answers
  const refetchRef = useRef(refetch)
  refetchRef.current = refetch
  const submitMutationRef = useRef(submitMutation)
  submitMutationRef.current = submitMutation

  useEffect(() => {
    if (!attempt) return
    if (!isExpired) return
    if (lockedRef.current) return
    if (submitMutationRef.current.isPending) return

    const payload: SubmitAttemptDto = buildAttemptAnswersPayload(answersRef.current)
    assertParentAttemptPayload(payload)

    submitMutationRef.current.mutate(payload, {
      onSuccess: () => {
        showInfoToast({ raw: t('timeExpired') })
        void refetchRef.current()
      },
      onError: (e: unknown) => {
        showErrorToast({ error: e })
        void refetchRef.current()
      },
    })
  }, [isExpired, attempt])

  useEffect(() => {
    if (!dirty || locked) return
    const handler = (ev: BeforeUnloadEvent) => {
      ev.preventDefault()
      ev.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, locked])

  const setAnswer = useCallback(
    (questionId: string, selectedAnswerId: string) => {
      if (locked) return
      setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswerId }))
      setDirty(true)
    },
    [locked],
  )

  const buildSavePayload = useCallback(() => {
    const payload = buildAttemptAnswersPayload(answers)
    assertParentAttemptPayload(payload)
    return payload
  }, [answers])

  const save = useCallback(async () => {
    if (locked) return
    const snapshot = JSON.stringify(answers)
    if (snapshot === lastSavedRef.current) {
      setDirty(false)
      return
    }

    try {
      const payload = buildSavePayload()
      await saveMutation.mutateAsync(payload)
      lastSavedRef.current = snapshot
      setDirty(false)
      showSuccessToast({ raw: t('progressSaved') })
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }, [answers, buildSavePayload, locked, saveMutation])

  useEffect(() => {
    if (!dirty) return
    if (locked) return
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    autosaveTimer.current = window.setTimeout(() => {
      void save()
    }, autosaveMs)
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    }
  }, [autosaveMs, dirty, locked, save])

  const submit = useCallback(async () => {
    if (locked) return
    const payload: SubmitAttemptDto = buildAttemptAnswersPayload(answers)
    assertParentAttemptPayload(payload)
    try {
      await submitMutation.mutateAsync(payload)
      showSuccessToast({ raw: t('attemptSubmitted') })
      lastSavedRef.current = JSON.stringify(answers)
      setDirty(false)
      await refetch()
    } catch (e: unknown) {
      showErrorToast({ error: e })
      throw e
    }
  }, [answers, locked, refetch, submitMutation])

  const answeredCount = useMemo(() => {
    return questionList.filter((q) => Boolean(answers[q.id])).length
  }, [answers, questionList])

  const allAnswered = questionList.length > 0 && answeredCount === questionList.length

  const sessionLoading =
    isLoading || (needsFormFallback && isFormLoading && questionList.length === 0)

  return {
    attempt,
    isLoading: sessionLoading,
    isError: isError || (needsFormFallback && isFormError),
    error,
    locked,
    isExpired,
    remainingMs,
    questionList,
    usesFormFallback,
    answers,
    dirty,
    answeredCount,
    allAnswered,
    missingAnswerIds,
    setAnswer,
    save,
    submit,
    saveMutation,
    submitMutation,
  }
}
