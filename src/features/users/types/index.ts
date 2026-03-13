export enum UserRole {
    ADMIN = 'admin',
    OWNER = 'owner',
    EMPLOYEE = 'employee',
    ENRICHER = 'enricher',
    TEACHER = 'teacher',
    PARENT = 'parent',
}


export interface User {
    id: string;

    name: string;

    email: string;

    password_hash: string;

    phone: string;

    role: UserRole;

    organizations: any[];

    children: any[];

    created_at: Date;

    updated_at: Date;
}