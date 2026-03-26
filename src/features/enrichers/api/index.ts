import { AccountType, Endpoint, Methods } from "@/lib/types/enums";
import { CreateEnrichers } from "../types/interfaces";
import { api } from "@/lib/api/api";

export async function createEnricher(data: CreateEnrichers) {
    return api.server(`/${Endpoint.AUTH}/${Endpoint.ENRICHERSSIGNUP}`, {
        method: Methods.POST,
        body: JSON.stringify({ ...data, accountType: AccountType.ENRCHER })
    })
}