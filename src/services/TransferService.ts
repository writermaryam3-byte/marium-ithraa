import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { ChildTransferRequest } from '@/features/children/types/interfaces'

export const TransferService = {
  async createTransferRequest(payload: {
    childId: string
    childType: 'organization' | 'private'
    toOrganizationId: string
  }): Promise<ChildTransferRequest> {
    return api.client<ChildTransferRequest>(`/${Endpoint.TRANSFERS}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
  },

  async getTransferRequests(fromOrganizationId: string): Promise<ChildTransferRequest[]> {
    const response = await api.client<{ requests: ChildTransferRequest[] }>(
      `/${Endpoint.TRANSFERS}?fromOrganizationId=${encodeURIComponent(
        fromOrganizationId,
      )}&status=pending`,
    )

    return response.requests ?? []
  },

  async approveTransferRequest(
    requestId: string,
    classId: string,
  ): Promise<ChildTransferRequest> {
    return api.client<ChildTransferRequest>(
      `/${Endpoint.TRANSFERS}/${encodeURIComponent(requestId)}/${Endpoint.APPROVE}`,
      {
        method: Methods.PATCH,
        body: JSON.stringify({ classId }),
      },
    )
  },

  async rejectTransferRequest(requestId: string): Promise<ChildTransferRequest> {
    return api.client<ChildTransferRequest>(
      `/${Endpoint.TRANSFERS}/${encodeURIComponent(requestId)}/${Endpoint.REJECT}`,
      {
        method: Methods.PATCH,
      },
    )
  },
}
