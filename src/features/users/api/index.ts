import { api } from "@/lib/api/api"
import { Endpoint } from "@/lib/types/enums"
import { IUserResponseDto, User } from "../types"

export const getUsersInRoles = () => {
    return api.client<{employees: User[], organizationOwners: User[], enrichers: User[]}>(`/${Endpoint.USERS}/${Endpoint.ROLES}`)
}

export const getAllUsers = () => {
    return api.server<{users: IUserResponseDto[]}>(`/${Endpoint.USERS}`)
}