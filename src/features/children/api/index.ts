import { api } from "@/lib/api/api"
import { Child } from "../types/interfaces"
import { Endpoint, Methods } from "@/lib/types/enums"

export const getChildren = async (userId: string) => {
  return api.server<{children: Child[]}>(`/${Endpoint.CHILDREN}?userId=${userId}`)
}

export const getAllChildren = async () => {
  return api.client<{children: Child[]}>(`/${Endpoint.CHILDREN}/${Endpoint.ALL}`)
}
export const getAllChildrenServer = async () => {
  return api.server<{children: Child[]}>(`/${Endpoint.CHILDREN}/${Endpoint.ALL}`)
}

export const createChild = async (data: Partial<Child>) => {
  return api.server(`/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const updateChild = async (childId: string, data: Partial<Child>) => {
  return api.server(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteChild = async (childId: string) => {
  return api.server(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.DELETE,
  })
}