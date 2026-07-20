import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type {
  CapacityRequest,
  CreateCapacityRequestPayload,
  PaymentSessionResult,
  UpdateCapacityRequestPayload,
} from '../types'

export const createCapacityRequest = async (payload: CreateCapacityRequestPayload) => {
  return api.client<CapacityRequest>(`/${Endpoint.CAPACITY_REQUESTS}`, {
    method: Methods.POST,
    body: JSON.stringify(payload),
  })
}

export const getCapacityRequests = async () => {
  return api.client<CapacityRequest[]>(`/${Endpoint.CAPACITY_REQUESTS}`)
}

export const getCapacityRequestById = async (id: string) => {
  return api.client<CapacityRequest>(`/${Endpoint.CAPACITY_REQUESTS}/${id}`)
}

export const updateCapacityRequest = async (id: string, payload: UpdateCapacityRequestPayload) => {
  return api.client<CapacityRequest>(`/${Endpoint.CAPACITY_REQUESTS}/${id}`, {
    method: Methods.PATCH,
    body: JSON.stringify(payload),
  })
}

export const approveCapacityRequest = async (id: string) => {
  return api.client<import('../types').ApproveCapacityRequestResult>(
    `/${Endpoint.CAPACITY_REQUESTS}/${id}/${Endpoint.APPROVE}`,
    { method: Methods.POST },
  )
}

export const rejectCapacityRequest = async (id: string, reason?: string) => {
  const trimmed = reason?.trim()
  return api.client<CapacityRequest>(`/${Endpoint.CAPACITY_REQUESTS}/${id}/${Endpoint.REJECT}`, {
    method: Methods.POST,
    body: JSON.stringify({ reason: trimmed || undefined }),
  })
}

export const resolveCapacityCheckout = async (id: string) => {
  return api.client<PaymentSessionResult>(
    `/${Endpoint.CAPACITY_REQUESTS}/${id}/${Endpoint.CHECKOUT}`,
    { method: Methods.POST },
  )
}
