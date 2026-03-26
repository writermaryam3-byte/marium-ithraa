import { useQuery } from "@tanstack/react-query"
import { getAllTests } from "../api"

export function useAdminTests() {
  return useQuery({
    queryKey: ["admin", "tests"],
    queryFn: getAllTests,
    staleTime: 1000 * 60 * 10,
  })
}
