import { useQuery } from "@tanstack/react-query"
import { getUsersInRoles } from "../api"

export function useAdminUsersInRoles() {
    return useQuery({
      queryKey: ["admin", "users-in-roles"],
      queryFn: getUsersInRoles,
      staleTime: 1000 * 60 * 10,
    })
  }