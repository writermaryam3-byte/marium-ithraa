import { Organization } from "@/features/organizations";
import { UserRole } from "@/lib/types/enums";




export interface User {
    id: string;

    name: string;

    email: string;

    password_hash: string;

    phone: string;

    role: UserRole;

    organization: Organization;

    children: any[];

    created_at: Date;

    updated_at: Date;
}