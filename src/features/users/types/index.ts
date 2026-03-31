import { Enricher } from "@/features/enrichers";
import { Organization } from "@/features/organizations";
import { UserRole } from "@/lib/types/enums";



export interface Role {
    id: string,
    name: string
}
export interface User {
    id: string;

    name: string;

    email: string;
    
    phone: string;

    role: UserRole;

    organization: Organization;

    enricher: Enricher

    children: unknown[];

    created_at: Date;

    updated_at: Date;
}

export interface IUserResponseDto {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    phone: string;
    isPhoneVerified: boolean;
    role: UserRole[];
  }