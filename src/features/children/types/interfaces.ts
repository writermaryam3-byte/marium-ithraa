import { Organization } from "@/features/organizations";
import { User } from "@/features/users";
import { Gender } from "@/lib/types/enums";


export interface Child {
    id: string;

    name: string;

    grade: string;

    birthDate: Date;

    gender: Gender;

    organization: Organization;

    user: User;

    profile: ChildProfile;

    created_at: Date;

    updated_at: Date;
}



export interface ChildReport {
    id: string;

    // assignment: TestAssignment;
    assignment: any;

    score_json: string;

    created_at: Date;
}
export interface ChildProfile {
    id: string;

    child: Child;

    diagnoses: string;

    notes: string;

    status: string;
}