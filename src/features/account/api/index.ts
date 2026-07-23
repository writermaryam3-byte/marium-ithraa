import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'

import type { IUserResponseDto } from '@/features/users/types'

export const getCurrentUserClient = async () => {
  return api.client<IUserResponseDto>(`/${Endpoint.USERS}/${Endpoint.ME}`, {
    method: Methods.GET,
  })
}

export const getCurrentUserServer = async () => {
  return api.server<IUserResponseDto>(`/${Endpoint.USERS}/${Endpoint.ME}`, {
    method: Methods.GET,
  })
}
