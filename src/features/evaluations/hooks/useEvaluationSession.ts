'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showInfoToast, showSuccessToast } from '@/lib/toast/app-toast'
import { ApiError } from '@/lib/errors/ApiError'

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
  const savingRef = useRef(false)
  const pendingSaveRef = useRef(false)
  const rateLimitedUntilRef = useRef(0)

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
  const saveMutationRef = useRef(saveMutation)
  saveMutationRef.current = saveMutation

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

  // Stable ref to the latest `save` so the trailing-flush timer can call it
  // without adding `save` to its own dependency list.
  const saveRef = useRef<((opts?: { silent?: boolean }) => Promise<void>) | null>(null)

  const save = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = opts?.silent ?? false
      if (lockedRef.current) return

      const snapshot = JSON.stringify(answersRef.current)
      if (snapshot === lastSavedRef.current) {
        setDirty(false)
        return
      }

      // Respect the rate-limit backoff window; queue a trailing flush.
      if (Date.now() < rateLimitedUntilRef.current) {
        pendingSaveRef.current = true
        return
      }

      // Single-flight: never run two saves at once. Concurrent triggers are
      // coalesced into one trailing flush after the in-flight save resolves.
      if (savingRef.current) {
        pendingSaveRef.current = true
        return
      }

      savingRef.current = true
      try {
        const payload = buildAttemptAnswersPayload(answersRef.current)
        assertParentAttemptPayload(payload)
        await saveMutationRef.current.mutateAsync(payload)
        lastSavedRef.current = snapshot
        // Only clear the dirty flag if no newer edits landed mid-request.
        if (JSON.stringify(answersRef.current) === snapshot) {
          setDirty(false)
        }
        if (!silent) showSuccessToast({ raw: t('progressSaved') })
      } catch (e: unknown) {
        const status = e instanceof ApiError ? e.status : undefined
        if (status === 429) {
          // Transient: back off and let the trailing flush retry once clear.
          const retryAfter = Number(e instanceof ApiError ? e.details?.retryAfter : undefined)
          const backoffMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 5000
          rateLimitedUntilRef.current = Date.now() + backoffMs
          pendingSaveRef.current = true
          if (!silent) showInfoToast({ raw: t('autosavePaused') })
        } else if (!silent) {
          // For hard errors surface only on explicit (manual) save. Autosave
          // stays silent to avoid a retry/toast storm; edits remain dirty and
          // flush on the next user action.
          showErrorToast({ error: e })
        }
      } finally {
        savingRef.current = false
        if (pendingSaveRef.current) {
          pendingSaveRef.current = false
          const wait = Math.max(400, rateLimitedUntilRef.current - Date.now())
          if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
          autosaveTimer.current = window.setTimeout(() => {
            void saveRef.current?.({ silent: true })
          }, wait)
        }
      }
    },
    [t],
  )
  saveRef.current = save

  useEffect(() => {
    if (!dirty || locked) return
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    autosaveTimer.current = window.setTimeout(() => {
      void save({ silent: true })
    }, autosaveMs)
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    }
  }, [autosaveMs, dirty, locked, answers, save])

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
