import { Employee } from "@/features/employees"
import { User } from "@/features/users"
import { ApprovalStatus, OrganizationType } from "@/lib/types/enums"




export type Organization = {
    id: string
    organization_name: string
    organization_type: OrganizationType
    approval_status: ApprovalStatus
  
    owner: User
    employees: Employee[]
  }