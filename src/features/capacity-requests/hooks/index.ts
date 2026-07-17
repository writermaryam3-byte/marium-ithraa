'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveCapacityRequest,
  createCapacityRequest,
  getCapacityRequests,
  rejectCapacityRequest,
  resolveCapacityCheckout,
  updateCapacityRequest,
} from '../api'
import type {
  CapacityRequest,
  CreateCapacityRequestPayload,
  UpdateCapacityRequestPayload,
} from '../types'

function filterByStatus(requests: CapacityRequest[], status?: string): CapacityRequest[] {
  if (!status || status === 'all') return requests
  return requests.filter((req) => req.status === status)
}

export function useCapacityRequests(status?: string) {
  return useQuery({
    queryKey: ['admin', 'capacity-requests', status ?? 'all'],
    queryFn: async () => {
      const requests = await getCapacityRequests()
      return filterByStatus(Array.isArray(requests) ? requests : [], status)
    },
  })
}

export function useCreateCapacityRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCapacityRequestPayload) => createCapacityRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'capacity-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'capacity-requests'] })
    },
  })
}

export function useParentCapacityRequests() {
  return useQuery({
    queryKey: ['parent', 'capacity-requests'],
    queryFn: async () => {
      const requests = await getCapacityRequests()
      return Array.isArray(requests) ? requests : []
    },
  })
}

export function useResolveCapacityCheckout() {
  return useMutation({
    mutationFn: (id: string) => resolveCapacityCheckout(id),
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
    mutationFn: (id: string) => approveCapacityRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capacity-requests'] })
    },
  })
}

export function useRejectCapacityRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rejectCapacityRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'capacity-requests'] })
    },
  })
}
