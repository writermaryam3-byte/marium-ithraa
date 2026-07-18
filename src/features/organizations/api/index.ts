import { CreateEmployee } from '@/features/employees/types/interfaces'
import { Endpoint, Methods } from '@/lib/types/enums'
import { api } from '@/lib/api/api'
import { unwrapPaginatedPayload, type PaginatedListPayload } from '@/lib/api/utils'
import type {
  ApprovalStatus,
  Organization,
  RejectOrganizationPayload,
  UpdateOrganizationPayload,
} from '../types/interfaces'
import { ApprovalStatus as ApprovalStatusEnum } from '@/lib/types/enums'

export type ListOrganizationsParams = {
  status?: ApprovalStatus
  page?: number
  limit?: number
  search?: string
}

function buildOrganizationsQuery(params?: ListOrganizationsParams): string {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.page != null) query.set('page', String(params.page))
  if (params?.limit != null) query.set('limit', String(params.limit))
  if (params?.search?.trim()) query.set('search', params.search.trim())
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

export const createEmployee = async (employee: CreateEmployee) => {
  return api.server(`/${Endpoint.EMPLOYEES}`, {
    method: Methods.POST,
    body: JSON.stringify(employee),
  })
}

export async function getMyOrganization() {
  return api.client<Organization>(`/${Endpoint.ORGANIZATIONS}/${Endpoint.ME}`)
}

export async function getMyOrganizationServer() {
  return api.server<Organization>(`/${Endpoint.ORGANIZATIONS}/${Endpoint.ME}`)
}

export async function listOrganizations(params?: ListOrganizationsParams) {
  const payload = await api.client<PaginatedListPayload<Organization> | Organization[]>(
    `/${Endpoint.ORGANIZATIONS}${buildOrganizationsQuery(params)}`,
  )
  return unwrapPaginatedPayload(payload)
}

export async function getAllOrganizations() {
  const { items } = await listOrganizations({ page: 1, limit: 1000 })
  return items
}

export async function getPendingOrganizations() {
  const { items } = await listOrganizations({
    status: ApprovalStatusEnum.PENDING,
    page: 1,
    limit: 1000,
  })
  return items
}

export async function getOrganizationsByStatus(status: ApprovalStatus, params?: Omit<ListOrganizationsParams, 'status'>) {
  return listOrganizations({ ...params, status })
}

export async function approveOrganization(id: string) {
  return api.client<Organization>(`/${Endpoint.ORGANIZATIONS}/${id}/${Endpoint.APPROVE}`, {
    method: Methods.PATCH,
  })
}

export async function rejectOrganization(id: string, body: RejectOrganizationPayload) {
  return api.client<Organization>(`/${Endpoint.ORGANIZATIONS}/${id}/${Endpoint.REJECT}`, {
    method: Methods.PATCH,
    body: JSON.stringify(body),
  })
}

export async function updateOrganization(id: string, body: UpdateOrganizationPayload) {
  return api.client<Organization>(`/${Endpoint.ORGANIZATIONS}/${id}`, {
    method: Methods.PATCH,
    body: JSON.stringify(body),
  })
}
