import { api } from "@/lib/api/api"
import { Endpoint } from "@/lib/types/enums"
import { User } from "../types"

export const getUsersInRoles = () => {
    return api.client<{employees: User[], organizationOwners: User[], enrichers: User[]}>(`/${Endpoint.USERS}/${Endpoint.ROLES}`)
}