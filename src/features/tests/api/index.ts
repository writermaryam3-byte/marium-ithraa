import { Endpoint, Methods } from "@/lib/types/enums"
import { Test } from "../types/interfaces"
import { api } from "@/lib/api/api"

export const getAllTests = async () => {
    return api.client<{tests: Test[]}>(`/${Endpoint.TESTS}`)
}

export const createTest = async (data: Partial<Test>) => {
    return api.server(`/${Endpoint.TESTS}`, { method: Methods.POST, body: JSON.stringify(data) })
}