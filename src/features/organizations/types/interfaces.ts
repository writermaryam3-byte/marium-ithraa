
import { ApprovalStatus, OrganizationType } from "@/lib/types/enums"




export type Organization = {
    id: string
    organization_name: string
    organization_type: OrganizationType
    approval_status: ApprovalStatus
  
  }