import { api } from '@/lib/api/api'
import { buildPaginationQuery, type PaginationParams } from '@/lib/api/pagination'
import type { ChildType } from '@/lib/types/interfaces'
import {
  type Child,
  type ChildTransferRequest,
  type CreateChildFlowPayload,
  type CreateChildResponse,
  type CreateChildWithParentPayload,
  type CreatePrivateChildPayload,
  type ParentSearchResult,
  type TransferRequestResponse,
  type UpdateChildPayload,
} from '../types/interfaces'
import { Endpoint, Methods } from '@/lib/types/enums'

export const getChildren = async (userId: string) => {
  return api.server<{
    organizationChildren: Child[]
    privateChildren: Child[]
  }>(`/${Endpoint.CHILDREN}?userId=${userId}`)
}

export const getAllChildren = async () => {
  return api.client<{
    organizationChildren: Child[]
    privateChildren: Child[]
  }>(`/${Endpoint.CHILDREN}/${Endpoint.ALL}`)
}

export const getAllChildrenServer = async (params?: PaginationParams) => {
  return api.server<{
    organizationChildren: Child[]
    privateChildren: Child[]
  }>(`/${Endpoint.CHILDREN}/${Endpoint.ALL}${buildPaginationQuery(params)}`)
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

export const getPrivateChildren = async () => {
  return api.server<{ children: Child[] }>(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}`)
}

export const getOrgChildren = async () => {
  return api.server<{ children: Child[] }>(`/${Endpoint.PARENT}/org-${Endpoint.CHILDREN}`)
}

export const createPrivateChild = async (data: CreatePrivateChildPayload) => {
  return api.server(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const searchParentsByPhone = async (phone: string) => {
  return api.client<ParentSearchResult>(
    `/${Endpoint.PARENT}s/search?phone=${encodeURIComponent(phone)}`,
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
  return api.client<TransferRequestResponse>('/child-transfers', {
    method: Methods.POST,
    body: JSON.stringify({ childId, childType, toOrganizationId }),
  })
}

export const getChildTransferRequests = async (fromOrganizationId: string) => {
  const response = await api.server<{
    requests?: ChildTransferRequest[]
    transferRequests?: ChildTransferRequest[]
    childTransfers?: ChildTransferRequest[]
  }>(`/child-transfers?fromOrganizationId=${encodeURIComponent(fromOrganizationId)}&status=pending`)

  return {
    requests: response.requests ?? response.transferRequests ?? response.childTransfers ?? [],
  }
}

export const approveChildTransfer = async (requestId: string, classId: string) => {
  return api.client<TransferRequestResponse>(`/child-transfers/${requestId}/approve`, {
    method: Methods.PATCH,
    body: JSON.stringify({ classId }),
  })
}

export const rejectChildTransfer = async (requestId: string) => {
  return api.client<TransferRequestResponse>(`/child-transfers/${requestId}/reject`, {
    method: Methods.PATCH,
  })
}
