import { api } from "@/lib/api/api"
import { Endpoint, Methods } from "@/lib/types/enums"

export const sendVerficationEmail = async (data: {email: string, userId: string})=>{
    return api.client(`/${Endpoint.MAILER}/${Endpoint.VERIFYEMAIL}`, {
        method: Methods.POST,
        body: JSON.stringify(data)
    })
}