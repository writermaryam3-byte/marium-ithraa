import { CreateEmployee } from '@/features/employees/types/interfaces'
import { Endpoint, Methods } from '@/lib/types/enums'
import { api } from '@/lib/api/api'
import type {
  ApprovalStatus,
  LegacyOrganizationsListResponse,
  Organization,
  OrganizationsListResponse,
  RejectOrganizationPayload,
} from '../types/interfaces'

type OrganizationsListApiResponse = OrganizationsListResponse | LegacyOrganizationsListResponse

function normalizeOrganizationsList(
  response: OrganizationsListApiResponse,
): OrganizationsListResponse {
  if (Array.isArray(response)) return response
  return response.organizations ?? []
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

export async function getAllOrganizations() {
  const response = await api.client<OrganizationsListApiResponse>(`/${Endpoint.ORGANIZATIONS}`)
  return normalizeOrganizationsList(response)
}

export async function getPendingOrganizations() {
  const response = await api.client<OrganizationsListApiResponse>(
    `/${Endpoint.ORGANIZATIONS}/${Endpoint.PENDING}`,
  )
  return normalizeOrganizationsList(response)
}

export async function getOrganizationsByStatus(status: ApprovalStatus) {
  const response = await api.client<OrganizationsListApiResponse>(
    `/${Endpoint.ORGANIZATIONS}?status=${status}`,
  )
  return normalizeOrganizationsList(response)
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
