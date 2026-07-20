'use client'

import { useQuery } from '@tanstack/react-query'

import { lookupChildren, lookupEvaluations, lookupUsers } from '../api'
import type { LookupParams } from '../types'

export const adminLookupKeys = {
  users: (params?: LookupParams) => ['admin-lookup', 'users', params ?? {}] as const,
  evaluations: (params?: LookupParams) => ['admin-lookup', 'evaluations', params ?? {}] as const,
  children: (params?: LookupParams) => ['admin-lookup', 'children', params ?? {}] as const,
}

export function useLookupUsers(params?: LookupParams, enabled = true) {
  return useQuery({
    queryKey: adminLookupKeys.users(params),
    queryFn: () => lookupUsers(params),
    enabled,
    staleTime: 30_000,
  })
}

export function useLookupEvaluations(params?: LookupParams, enabled = true) {
  return useQuery({
    queryKey: adminLookupKeys.evaluations(params),
    queryFn: () => lookupEvaluations(params),
    enabled,
    staleTime: 30_000,
  })
}

export function useLookupChildren(params?: LookupParams, enabled = true) {
  return useQuery({
    queryKey: adminLookupKeys.children(params),
    queryFn: () => lookupChildren(params),
    enabled,
    staleTime: 30_000,
  })
}
