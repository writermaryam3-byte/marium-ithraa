import { api } from '@/lib/api/api'
import { buildPaginationQuery, type PaginationParams } from '@/lib/api/pagination'
import type { ChildType, PaginationMeta } from '@/lib/types/interfaces'
import {
  type Child,
  type ChildTransferRequest,
  type CreateChildFlowPayload,
  type CreateChildResponse,
  type CreateChildWithParentPayload,
  type CreatePrivateChildPayload,
  type ParentSearchResult,
  type UpdateChildPayload,
} from '../types/interfaces'
import { Endpoint, Methods } from '@/lib/types/enums'

export const getChildren = async (userId: string, params?: PaginationParams) => {
  const query = buildPaginationQuery(params)
  return api.client<Child[]>(`/${Endpoint.CHILDREN}?userId=${userId}${query}`)
}

export type PaginatedChildrenResponse = {
  data: Child[]
  meta: PaginationMeta
}

export const getAllChildren = async (
  params?: PaginationParams,
): Promise<PaginatedChildrenResponse> => {
  const query = buildPaginationQuery(params)
  return api.client<PaginatedChildrenResponse>(`/${Endpoint.CHILDREN}/${Endpoint.ALL}${query}`)
}

export const getAllChildrenServer = async (params?: PaginationParams) => {
  return api.server<PaginatedChildrenResponse>(
    `/${Endpoint.CHILDREN}/${Endpoint.ALL}${buildPaginationQuery(params)}`,
  )
}

export const getAllChildrenByOrg = async (orgId: string) => {
  return api.server<{ children: Child[] }>(`/${Endpoint.CHILDREN}/organization/${orgId}`)
}

export const getChildById = async (childId: string) => {
  return api.server<{ child: Child }>(`/${Endpoint.CHILDREN}/${childId}`)
}

export const createChild = async (data: Partial<Child> | CreateChildWithParentPayload) => {
  return api.server(`/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const updateChild = async (childId: string, data: UpdateChildPayload) => {
  return api.server(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteChild = async (childId: string) => {
  return api.server(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.DELETE,
  })
}

export const getPrivateChildren = async (params?: PaginationParams) => {
  const query = buildPaginationQuery(params)
  return api.client<PaginatedChildrenResponse>(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}${query}`)
}

export const getOrgChildren = async (params?: PaginationParams) => {
  const query = buildPaginationQuery(params)
  return api.client<PaginatedChildrenResponse>(`/${Endpoint.PARENT}/org-${Endpoint.CHILDREN}${query}`)
}

export const getPrivateChildrenServer = async (params?: PaginationParams) => {
  return api.server<PaginatedChildrenResponse>(
    `/${Endpoint.PARENT}/${Endpoint.CHILDREN}${buildPaginationQuery(params)}`,
  )
}

export const getOrgChildrenServer = async (params?: PaginationParams) => {
  return api.server<PaginatedChildrenResponse>(
    `/${Endpoint.PARENT}/org-${Endpoint.CHILDREN}${buildPaginationQuery(params)}`,
  )
}

export const createPrivateChild = async (data: CreatePrivateChildPayload) => {
  return api.server(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const searchParentsByPhone = async (phone: string) => {
  return api.client<ParentSearchResult>(
    `/${Endpoint.PARENTS}/search?phone=${encodeURIComponent(phone)}`,
  )
}

export const getChildByIdClient = async (childId: string) => {
  return api.client<{ child: Child }>(`/${Endpoint.CHILDREN}/${childId}`)
}

export const createChildFlow = async (data: CreateChildFlowPayload) => {
  return api.client<CreateChildResponse>(`/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const requestChildTransfer = async (
  childId: string,
  childType: ChildType,
  toOrganizationId: string,
) => {
  return api.client<ChildTransferRequest>(`/child-transfers`, {
    method: Methods.POST,
    body: JSON.stringify({ childId, childType, toOrganizationId }),
  })
}

export const getChildTransferRequests = async (fromOrganizationId: string) => {
  const response = await api.client<{ requests: ChildTransferRequest[] }>(
    `/child-transfers?fromOrganizationId=${encodeURIComponent(fromOrganizationId)}&status=pending`,
  )

  return { requests: response.requests ?? [] }
}

export const approveChildTransfer = async (requestId: string, classId: string) => {
  return api.client<ChildTransferRequest>(`/child-transfers/${requestId}/approve`, {
    method: Methods.PATCH,
    body: JSON.stringify({ classId }),
  })
}

export const rejectChildTransfer = async (requestId: string) => {
  return api.client<ChildTransferRequest>(`/child-transfers/${requestId}/reject`, {
    method: Methods.PATCH,
  })
}
