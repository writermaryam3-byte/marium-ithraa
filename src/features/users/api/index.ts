import { api } from '@/lib/api/api'
import { Endpoint } from '@/lib/types/enums'
import { IUserResponseDto } from '../types'

export const getUsersInRoles = () => {
  return api.client<{ teachers: IUserResponseDto[]; organizationOwners: IUserResponseDto[]; enrichers: IUserResponseDto[] }>(
    `/${Endpoint.USERS}/${Endpoint.ROLES}`,
  )
}

export const getAllUsers = () => {
  return api.server<{ users: IUserResponseDto[] }>(`/${Endpoint.USERS}`)
}
