import { BaseSignup } from "@/features/auth";
import { User } from "@/features/users";
import { AccountType, ApprovalStatus } from "@/lib/types/enums";

export interface Enricher {
    id: string;
  

    user: User;
  
    organization_name: string;
  

    approval_status: ApprovalStatus;
}

export interface CreateEnrichers extends BaseSignup {
    organizationName: string;
  
    accountType: AccountType.ENRCHER;
  }