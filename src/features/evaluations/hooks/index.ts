import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { GetAttemptsFilters } from '../api'
import type { CreateEvaluationDto } from '../types'
import {
  approveAttemptClient,
  createEvaluationClient,
  getAttemptByIdClient,
  getAttemptsClient,
  getAttemptsForChildClient,
  getAvailableEvaluationsForChildClient,
  approveExtraAttemptClient,
  getChildEvaluationStateClient,
  listExtraAttemptRequestsClient,
  rejectExtraAttemptClient,
  getEvaluationDetailsClient,
  getEvaluationFormClient,
  getEvaluationsClient,
  openPrivateMainSlotClient,
  requestPrivateExtraAttemptClient,
  requestPrivateRetakeClient,
  saveAttemptProgressClient,
  startEvaluationClient,
  submitAttemptClient,
  updateEvaluationClient,
  type UpdateEvaluationPayload,
} from '../api'
import type { SaveAttemptDto, StartAttemptDto, SubmitAttemptDto } from '../types'
import { initiatePayment } from '@/features/payments/api'

export const evaluationKeys = {
  all: ['evaluations'] as const,
  detail: (id: string) => ['evaluation', id] as const,
  form: (id: string) => ['evaluation-form', id] as const,
  available: (childId: string) => ['evaluations-available', childId] as const,
  attempts: (filters?: GetAttemptsFilters) => ['attempts', filters ?? {}] as const,
  attempt: (id: string) => ['attempt', id] as const,
  childAttempts: (childId: string) => ['child-attempts', childId] as const,
  childState: (childId: string) => ['child-evaluation-state', childId] as const,
  extraRequests: () => ['admin-extra-attempt-requests'] as const,
}

export function useEvaluations() {
  return useQuery({
    queryKey: evaluationKeys.all,
    queryFn: getEvaluationsClient,
  })
}

export function useEvaluationDetails(evaluationId: string) {
  return useQuery({
    queryKey: evaluationKeys.detail(evaluationId),
    queryFn: () => getEvaluationDetailsClient(evaluationId),
    enabled: Boolean(evaluationId),
  })
}

export function useEvaluationForm(evaluationId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: evaluationKeys.form(evaluationId),
    queryFn: () => getEvaluationFormClient(evaluationId),
    enabled: options?.enabled ?? Boolean(evaluationId),
  })
}

export function useAvailableEvaluations(childId: string) {
  return useQuery({
    queryKey: evaluationKeys.available(childId),
    queryFn: () => getAvailableEvaluationsForChildClient(childId),
    enabled: Boolean(childId),
  })
}

export function useAttempts(filters?: GetAttemptsFilters) {
  return useQuery({
    queryKey: evaluationKeys.attempts(filters),
    queryFn: () => getAttemptsClient(filters),
  })
}

export function useChildAttempts(childId: string) {
  return useQuery({
    queryKey: evaluationKeys.childAttempts(childId),
    queryFn: () => getAttemptsForChildClient(childId),
    enabled: Boolean(childId),
  })
}

export function useChildEvaluationState(childId: string) {
  return useQuery({
    queryKey: evaluationKeys.childState(childId),
    queryFn: () => getChildEvaluationStateClient(childId),
    enabled: Boolean(childId),
    // While a paid extra attempt is awaiting payment, poll so the UI flips to
    // "unlocked" automatically once the payment webhook lands.
    refetchInterval: (query) =>
      query.state.data?.extra?.status === 'AWAITING_PAYMENT' ? 5000 : false,
  })
}

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: evaluationKeys.attempt(attemptId),
    queryFn: () => getAttemptByIdClient(attemptId),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 10,
  })
}

export function useCreateEvaluation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEvaluationDto) => createEvaluationClient(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: evaluationKeys.all })
    },
  })
}

export function useUpdateEvaluation(evaluationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateEvaluationPayload) => updateEvaluationClient(evaluationId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: evaluationKeys.all })
      void queryClient.invalidateQueries({ queryKey: evaluationKeys.detail(evaluationId) })
    },
  })
}

export function useStartEvaluation(evaluationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: StartAttemptDto) => startEvaluationClient(evaluationId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attempts'] })
      void queryClient.invalidateQueries({ queryKey: ['child-attempts'] })
      void queryClient.invalidateQueries({ queryKey: ['child-evaluation-state'] })
    },
  })
}

export function useSaveAttemptProgress(attemptId: string) {
  return useMutation({
    mutationFn: (data: SaveAttemptDto) => saveAttemptProgressClient(attemptId, data),
  })
}

export function useSubmitAttempt(attemptId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SubmitAttemptDto) => submitAttemptClient(attemptId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.attempt(attemptId),
      })
      void queryClient.invalidateQueries({ queryKey: ['attempts'] })
      void queryClient.invalidateQueries({ queryKey: ['child-attempts'] })
    },
  })
}

export function useApproveAttempt(attemptId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => approveAttemptClient(attemptId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.attempt(attemptId),
      })
      void queryClient.invalidateQueries({ queryKey: ['attempts'] })
    },
  })
}

export function useOpenPrivateMainSlot(childId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => openPrivateMainSlotClient(childId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childAttempts(childId),
      })
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childState(childId),
      })
    },
  })
}

export function useRequestPrivateRetake(childId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => requestPrivateRetakeClient(childId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childAttempts(childId),
      })
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childState(childId),
      })
    },
  })
}

export {
  ownerEvaluationKeys,
  useOwnerClassEvaluationStatus,
  useOwnerClassEvaluationSummary,
  useOwnerEvaluationFilters,
  useOwnerEvaluationReports,
  useSendOwnerEvaluationReminder,
} from './owner'

export function useRequestPrivateExtraAttempt(childId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quantity: number = 1) => requestPrivateExtraAttemptClient(childId, quantity),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childAttempts(childId),
      })
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childState(childId),
      })
    },
  })
}

export function useExtraAttemptRequests() {
  return useQuery({
    queryKey: evaluationKeys.extraRequests(),
    queryFn: listExtraAttemptRequestsClient,
  })
}

export function useApproveExtraAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slotId: string) => approveExtraAttemptClient(slotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: evaluationKeys.extraRequests() })
    },
  })
}

export function useRejectExtraAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slotId: string) => rejectExtraAttemptClient(slotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: evaluationKeys.extraRequests() })
    },
  })
}

export function useInitiateExtraPayment(childId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slotId: string) => initiatePayment(slotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: evaluationKeys.childState(childId),
      })
    },
  })
}
