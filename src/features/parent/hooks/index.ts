'use client'

import { useQuery } from '@tanstack/react-query'

import { getParentProfile } from '../api'

export const parentProfileKeys = {
  me: ['parent', 'profile'] as const,
}

export function useParentProfile() {
  return useQuery({
    queryKey: parentProfileKeys.me,
    queryFn: getParentProfile,
    staleTime: 1000 * 60 * 2,
  })
}
