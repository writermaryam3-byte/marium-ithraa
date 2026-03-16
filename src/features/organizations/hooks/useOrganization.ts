import { useQuery } from "@tanstack/react-query"
import { getUserOrganization } from "../api"

export function useOrganization(userId?: string) {
  return useQuery({
    queryKey: ["organization", userId],
    queryFn: async () => {
      const res = await getUserOrganization(userId!)
      return res.json()
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  })
}