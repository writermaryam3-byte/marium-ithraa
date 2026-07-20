import { ApprovalStatus, OrganizationType } from '@/lib/types/enums'

export type { ApprovalStatus, OrganizationType }

export type OrganizationOwner = {
  id: string
  name: string
  email: string
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
  ownerId?: string
  owner?: OrganizationOwner | null
  createdAt?: string
  updatedAt?: string
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

export type UpdateOrganizationPayload = {
  organizationName?: string
  organizationType?: OrganizationType
}
