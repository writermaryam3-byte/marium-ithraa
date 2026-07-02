import { useQuery } from '@tanstack/react-query'
import { getAllChildren } from '../api'
export { useParentSearch } from './useParentSearch'
export { useCreateChild } from './useCreateChild'

export function useAdminChildren() {
  return useQuery({
    queryKey: ['admin', 'children'],
    queryFn: getAllChildren,
    staleTime: 1000 * 60 * 10,
  })
}
