import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type {
  CapacityRequest,
  CreateCapacityRequestPayload,
  UpdateCapacityRequestPayload,
} from '../types'

export const createCapacityRequest = async (payload: CreateCapacityRequestPayload) => {
  return api.client<{ capacityRequest: CapacityRequest }>(`/${Endpoint.CAPACITY_REQUESTS}`, {
    method: Methods.POST,
    body: JSON.stringify(payload),
  })
}

export const getCapacityRequests = async (status?: string) => {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return api.server<{ capacityRequests: CapacityRequest[] }>(
    `/${Endpoint.CAPACITY_REQUESTS}${query}`,
  )
}

export const getCapacityRequestById = async (id: string) => {
  return api.server<{ capacityRequest: CapacityRequest }>(`/${Endpoint.CAPACITY_REQUESTS}/${id}`)
}

export const updateCapacityRequest = async (id: string, payload: UpdateCapacityRequestPayload) => {
  return api.server<{ capacityRequest: CapacityRequest }>(`/${Endpoint.CAPACITY_REQUESTS}/${id}`, {
    method: Methods.PATCH,
    body: JSON.stringify(payload),
  })
}

export const approveCapacityRequest = async (id: string, organizationId?: string) => {
  return api.server<{ capacityRequest: CapacityRequest }>(
    `/${Endpoint.CAPACITY_REQUESTS}/${id}/${Endpoint.APPROVE}`,
    { method: Methods.POST, body: JSON.stringify({ organizationId }) },
  )
}

export const rejectCapacityRequest = async (id: string, reason?: string) => {
  return api.server<{ capacityRequest: CapacityRequest }>(
    `/${Endpoint.CAPACITY_REQUESTS}/${id}/${Endpoint.REJECT}`,
    { method: Methods.POST, body: JSON.stringify({ reason }) },
  )
}
