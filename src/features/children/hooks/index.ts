import { useQuery } from '@tanstack/react-query'
import { getAllChildren, type PaginatedChildrenResponse } from '../api'
export { useParentSearch } from './useParentSearch'
export { useCreateChild } from './useCreateChild'

export function useAdminChildren() {
  return useQuery({
    queryKey: ['admin', 'children'] as const,
    queryFn: (): Promise<PaginatedChildrenResponse> => getAllChildren(),
    staleTime: 1000 * 60 * 10,
  })
}
