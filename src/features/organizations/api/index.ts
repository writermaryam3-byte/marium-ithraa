import { CreateEmployee } from "@/features/employees/types/interfaces"
import { apiFetch as serverApiFetch } from "@/lib/api-clent"
import { apiFetch } from "@/lib/client-api-client"
import { Endpoint, Methods } from "@/lib/types/enums"

export const createEmployee = async (employee: CreateEmployee)=>{
    return serverApiFetch(`/${Endpoint.EMPLOYEES}`,{
        method: Methods.POST,
        body: JSON.stringify(employee)
    })
}

export async function getUserOrganization(userId:string) {
    return apiFetch(`/${Endpoint.ORGANIZATIONS}/${Endpoint.OWNER}/${userId}`)
    
}