import { BaseSignup } from "@/features/auth";
import { User } from "@/features/users";

export interface Employee {
  id: string;
  user: User;
  job_title: string;
}

export interface CreateEmployee extends BaseSignup {
  job_title: string;
  organization_id: string;
}

export type UpdateEmployee = Partial<Omit<CreateEmployee, "organization_id">>; 