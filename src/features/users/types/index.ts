import { Enricher } from "@/features/enrichers";
import { Organization } from "@/features/organizations";
import { UserRole } from "@/lib/types/enums";




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