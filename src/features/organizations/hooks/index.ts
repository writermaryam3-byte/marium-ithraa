import { useQuery } from "@tanstack/react-query"
import { getAllOrganizations, getUserOrganization } from "../api"

export function useOrganization(userId?: string) {
  return useQuery({
    queryKey: ["organization", userId],
    queryFn: async () => getUserOrganization(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  })
}
export function useAdminOrganization() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizations,
    staleTime: 1000 * 60 * 10,
  })
}