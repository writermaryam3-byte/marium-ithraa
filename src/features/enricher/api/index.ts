import { apiFetch } from "@/lib/api-clent";
import { AccountType, Endpoint, Methods } from "@/lib/types/enums";
import { CreateEnrichers } from "../types/interfaces";

export async function createEnricher(data:CreateEnrichers) {
    return apiFetch(`/${Endpoint.AUTH}/${Endpoint.ENRICHERSSIGNUP}`,{
        method: Methods.POST,
        body: JSON.stringify({...data, accountType: AccountType.ENRCHER})
    })
}