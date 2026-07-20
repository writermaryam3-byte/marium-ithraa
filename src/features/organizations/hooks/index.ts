import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ApprovalStatus } from '@/lib/types/enums'

import {
  approveOrganization,
  getAllOrganizations,
  getMyOrganization,
  getOrganizationsByStatus,
  getPendingOrganizations,
  listOrganizations,
  rejectOrganization,
  updateOrganization,
  type ListOrganizationsParams,
} from '../api'
import type { RejectOrganizationPayload, UpdateOrganizationPayload } from '../types/interfaces'

export const organizationKeys = {
  all: ['organizations'] as const,
  pending: ['organizations', 'pending'] as const,
  byStatus: (status: ApprovalStatus) => ['organizations', { status }] as const,
  list: (params: ListOrganizationsParams) => ['organizations', 'list', params] as const,
  me: ['organizations', 'me'] as const,
  detail: (id: string) => ['organizations', id] as const,
}

export function useOrganization(userId?: string) {
  return useQuery({
    queryKey: ['organization', userId],
    queryFn: getMyOrganization,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  })
}

export function useAdminOrganization() {
  return useQuery({
    queryKey: organizationKeys.all,
    queryFn: getAllOrganizations,
    staleTime: 1000 * 60 * 10,
  })
}

export function useMyOrganization() {
  return useQuery({
    queryKey: organizationKeys.me,
    queryFn: getMyOrganization,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePendingOrganizations() {
  return useQuery({
    queryKey: organizationKeys.pending,
    queryFn: getPendingOrganizations,
  })
}

export function useOrganizationsByStatus(status: ApprovalStatus, params?: Omit<ListOrganizationsParams, 'status'>) {
  return useQuery({
    queryKey: organizationKeys.list({ ...params, status }),
    queryFn: () => getOrganizationsByStatus(status, params),
  })
}

export function useOrganizationsList(params: ListOrganizationsParams) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => listOrganizations(params),
  })
}

function invalidateOrganizationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: organizationKeys.all })
  void queryClient.invalidateQueries({ queryKey: organizationKeys.pending })
  void queryClient.invalidateQueries({ queryKey: organizationKeys.me })
  void queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] })
  void queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey[0] === 'organizations' &&
      typeof query.queryKey[1] === 'object',
  })
}

export function useApproveOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => approveOrganization(id),
    onSuccess: () => {
      invalidateOrganizationQueries(queryClient)
    },
  })
}

export function useRejectOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: RejectOrganizationPayload & { id: string }) =>
      rejectOrganization(id, body),
    onSuccess: () => {
      invalidateOrganizationQueries(queryClient)
    },
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrganizationPayload & { id: string }) =>
      updateOrganization(id, body),
    onSuccess: () => {
      invalidateOrganizationQueries(queryClient)
    },
  })
}

export { useOrganizationApproval } from './useOrganizationApproval'
