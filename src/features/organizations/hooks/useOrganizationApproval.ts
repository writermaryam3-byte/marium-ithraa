'use client'

import { useMyOrganization } from '@/features/organizations'
import { ApprovalStatus } from '@/lib/types/enums'

export function useOrganizationApproval() {
  const { data: organization, isLoading, isError } = useMyOrganization()

  return {
    organization,
    isLoading,
    isError,
    isApproved: organization?.approvalStatus === ApprovalStatus.APPROVED,
    isPending: organization?.approvalStatus === ApprovalStatus.PENDING,
    isRejected: organization?.approvalStatus === ApprovalStatus.REJECTED,
  }
}
