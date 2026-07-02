import { ApprovalStatus, OrganizationType } from '@/lib/types/enums'

export type { ApprovalStatus, OrganizationType }

export type OrganizationOwner = {
  id?: string
  name?: string
  email?: string
  phone?: string
}

export type Organization = {
  id: string
  organizationName: string
  organizationType: OrganizationType
  approvalStatus: ApprovalStatus
  rejectionReason?: string | null
  approvedAt?: string | null
  rejectedAt?: string | null
  approvedById?: string | null
  rejectedById?: string | null
  owner?: OrganizationOwner | null
  createdAt?: string
  updatedAt?: string
}

/**
 * Backend contract: organization list endpoints return Organization[] directly.
 * The API layer tolerates the legacy { organizations: Organization[] } shape
 * while callers should consume this normalized array type.
 */
export type OrganizationsListResponse = Organization[]

export type LegacyOrganizationsListResponse = {
  organizations: Organization[]
}

export type BeneficiarySignupOrganization = {
  id: string
  organizationName: string
  organizationType: OrganizationType
  approvalStatus: ApprovalStatus
}

export type RejectOrganizationPayload = {
  rejectionReason: string
}
