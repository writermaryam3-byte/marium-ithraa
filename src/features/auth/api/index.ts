import { api } from "@/lib/api/api"
import { Endpoint } from "@/lib/types/enums"

export const verifyEmail = async (token: string) => {
    console.log("token from api server", token)
    return api.server<{ message: string, ok: boolean }>(`/${Endpoint.AUTH}/verify-email?token=${token}`)
}