import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'

export const sendVerificationEmail = async (data: { email: string; userId: string }) => {
  return api.client(`/${Endpoint.NOTIFICATIONS}/${Endpoint.VERIFYEMAIL}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}
