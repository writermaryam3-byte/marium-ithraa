import { getUserOrganization } from "@/features/organizations"
import nextAuthOptions from "@/server/auth"
import { getServerSession } from "next-auth"

export const getCurrentOrganization = async () => {
    const session = await getServerSession(nextAuthOptions)
    return getUserOrganization(session?.user?.id||"")
  }