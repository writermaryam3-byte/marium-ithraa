import { Endpoint, Methods } from "@/lib/types/enums"
import { CreateEmployee, Employee, UpdateEmployee } from "../types/interfaces"
import { api } from "@/lib/api/api"

export const getEmployeesByOrganization = async (organizationId: string) => {
  return api.server<{employees: Employee[]}>(`/${Endpoint.EMPLOYEESBYORGNIZATION}/${organizationId}`)
}

export const getEmployeeById = async (employeeId: string) => {
  return api.server<Employee>(`/${Endpoint.EMPLOYEES}/${employeeId}`)
}

export const addEmployee = async (createEmployee: CreateEmployee) => {
  return api.server(`/${Endpoint.EMPLOYEES}`, {
    method: Methods.POST,
    body: JSON.stringify(createEmployee),
  })
}

export const updateEmployee = async (employeeId: string, data: UpdateEmployee) => {
  return api.server(`/${Endpoint.EMPLOYEES}/${employeeId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteEmployee = async (employeeId: string) => {
  return api.server(`/${Endpoint.EMPLOYEES}/${employeeId}`, {
    method: Methods.DELETE,
  })
}