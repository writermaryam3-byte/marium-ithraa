import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getOwnerClassEvaluationStatusClient,
  getOwnerClassEvaluationSummaryClient,
  getOwnerEvaluationFiltersClient,
  getOwnerEvaluationReportsClient,
  sendOwnerEvaluationReminderClient,
} from '../api'

export const ownerEvaluationKeys = {
  filters: ['owner-evaluation-filters'] as const,
  reports: (evaluationId?: string) => ['owner-evaluation-reports', evaluationId ?? 'all'] as const,
  summary: (classId: string, evaluationId: string) =>
    ['owner-evaluation-summary', classId, evaluationId] as const,
  status: (classId: string, evaluationId: string) =>
    ['owner-evaluation-status', classId, evaluationId] as const,
}

export function useOwnerEvaluationFilters() {
  return useQuery({
    queryKey: ownerEvaluationKeys.filters,
    queryFn: getOwnerEvaluationFiltersClient,
    staleTime: 1000 * 60 * 5,
  })
}

export function useOwnerEvaluationReports(evaluationId?: string) {
  return useQuery({
    queryKey: ownerEvaluationKeys.reports(evaluationId),
    queryFn: () => getOwnerEvaluationReportsClient(evaluationId),
  })
}

export function useOwnerClassEvaluationSummary(classId: string, evaluationId: string) {
  const enabled = Boolean(classId && evaluationId)
  return useQuery({
    queryKey: ownerEvaluationKeys.summary(classId, evaluationId),
    queryFn: () => getOwnerClassEvaluationSummaryClient(classId, evaluationId),
    enabled,
  })
}

export function useOwnerClassEvaluationStatus(classId: string, evaluationId: string) {
  const enabled = Boolean(classId && evaluationId)
  return useQuery({
    queryKey: ownerEvaluationKeys.status(classId, evaluationId),
    queryFn: () => getOwnerClassEvaluationStatusClient(classId, evaluationId),
    enabled,
  })
}

export function useSendOwnerEvaluationReminder(classId: string, evaluationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (childId: string) => sendOwnerEvaluationReminderClient(childId),
    onSuccess: () => {
      if (classId && evaluationId) {
        void queryClient.invalidateQueries({
          queryKey: ownerEvaluationKeys.status(classId, evaluationId),
        })
        void queryClient.invalidateQueries({
          queryKey: ownerEvaluationKeys.summary(classId, evaluationId),
        })
      }
    },
  })
}
