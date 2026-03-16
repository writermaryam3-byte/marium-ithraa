import { apiFetch } from "@/lib/api-clent"
import { Endpoint, Methods } from "@/lib/types/enums"
import { CreateEmployee, UpdateEmployee } from "../types/interfaces"

export const getEmployeesByOrganization = async (organizationId: string) => {
  return apiFetch(`/${Endpoint.EMPLOYEESBYORGNIZATION}/${organizationId}`)
}

export const getEmployeeById = async (employeeId: string) => {
  return apiFetch(`/${Endpoint.EMPLOYEES}/${employeeId}`)
}

export const addEmployee = async (createEmployee: CreateEmployee) => {
  return apiFetch(`/${Endpoint.EMPLOYEES}`, {
    method: Methods.POST,
    body: JSON.stringify(createEmployee),
  })
}

export const updateEmployee = async (employeeId: string, data: UpdateEmployee) => {
  return apiFetch(`/${Endpoint.EMPLOYEES}/${employeeId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteEmployee = async (employeeId: string) => {
  return apiFetch(`/${Endpoint.EMPLOYEES}/${employeeId}`, {
    method: Methods.DELETE,
  })
}