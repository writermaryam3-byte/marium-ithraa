import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ApprovalStatus } from '@/lib/types/enums'
import { ApprovalStatus as ApprovalStatusEnum } from '@/lib/types/enums'

import {
  approveOrganization,
  getAllOrganizations,
  getMyOrganization,
  getOrganizationsByStatus,
  getPendingOrganizations,
  rejectOrganization,
} from '../api'
import type { RejectOrganizationPayload } from '../types/interfaces'

export const organizationKeys = {
  all: ['organizations'] as const,
  pending: ['organizations', 'pending'] as const,
  byStatus: (status: ApprovalStatus) => ['organizations', { status }] as const,
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

export function useOrganizationsByStatus(status: ApprovalStatus) {
  return useQuery({
    queryKey: organizationKeys.byStatus(status),
    queryFn: () => getOrganizationsByStatus(status),
  })
}

function invalidateOrganizationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  statuses: ApprovalStatus[],
) {
  void queryClient.invalidateQueries({ queryKey: organizationKeys.all })
  void queryClient.invalidateQueries({ queryKey: organizationKeys.pending })
  statuses.forEach((status) => {
    void queryClient.invalidateQueries({ queryKey: organizationKeys.byStatus(status) })
  })
  void queryClient.invalidateQueries({ queryKey: organizationKeys.me })
}

export function useApproveOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => approveOrganization(id),
    onSuccess: () => {
      invalidateOrganizationQueries(queryClient, [
        ApprovalStatusEnum.PENDING,
        ApprovalStatusEnum.APPROVED,
      ])
    },
  })
}

export function useRejectOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: RejectOrganizationPayload & { id: string }) =>
      rejectOrganization(id, body),
    onSuccess: () => {
      invalidateOrganizationQueries(queryClient, [
        ApprovalStatusEnum.PENDING,
        ApprovalStatusEnum.REJECTED,
      ])
    },
  })
}

export { useOrganizationApproval } from './useOrganizationApproval'
