'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveCapacityRequest,
  createCapacityRequest,
  getCapacityRequests,
  rejectCapacityRequest,
  updateCapacityRequest,
} from '../api'
import type { CreateCapacityRequestPayload, UpdateCapacityRequestPayload } from '../types'

export function useCapacityRequests(status?: string) {
  return useQuery({
    queryKey: ['admin', 'capacity-requests', status],
    queryFn: () => getCapacityRequests(status),
  })
}

export function useCreateCapacityRequest() {
  return useMutation({
    mutationFn: (payload: CreateCapacityRequestPayload) => createCapacityRequest(payload),
  })
}

export function useUpdateCapacityRequest(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateCapacityRequestPayload) => updateCapacityRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capacity-requests'] })
    },
  })
}

export function useApproveCapacityRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, organizationId }: { id: string; organizationId?: string }) =>
      approveCapacityRequest(id, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capacity-requests'] })
    },
  })
}

export function useRejectCapacityRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectCapacityRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capacity-requests'] })
    },
  })
}
