import { CreateEmployee } from "@/features/employees/types/interfaces"
import { Endpoint, Methods } from "@/lib/types/enums"
import { api } from "@/lib/api/api"
import { User } from "@/features/users"

export const createEmployee = async (employee: CreateEmployee) => {
    return api.server(`/${Endpoint.EMPLOYEES}`, {
        method: Methods.POST,
        body: JSON.stringify(employee)
    })
}

export async function getUserOrganization(userId: string) {
    return api.server<{user: User}>(`/${Endpoint.USERS}/${Endpoint.ORGANIZATIONOWNER}/${userId}`)

}

export async function getAllOrganizations() {
    return api.client(`/${Endpoint.ORGANIZATIONS}`)
}