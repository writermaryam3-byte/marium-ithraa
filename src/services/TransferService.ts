import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { TransferRequest, TransferRequestPayload } from '@/lib/types/interfaces'
import type { TransferRequestResponse } from '@/features/children'

export const TransferService = {
  async createTransferRequest(payload: TransferRequestPayload): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(`/${Endpoint.TRANSFERS}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
  },

  async getTransferRequests(fromOrganizationId: string): Promise<TransferRequest[]> {
    const response = await api.client<{
      requests?: TransferRequest[]
      transferRequests?: TransferRequest[]
      childTransfers?: TransferRequest[]
    }>(
      `/${Endpoint.TRANSFERS}?fromOrganizationId=${encodeURIComponent(
        fromOrganizationId,
      )}&status=pending`,
    )

    return response.requests ?? response.transferRequests ?? response.childTransfers ?? []
  },

  async approveTransferRequest(
    requestId: string,
    classId: string,
  ): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(
      `/${Endpoint.TRANSFERS}/${encodeURIComponent(requestId)}/${Endpoint.APPROVE}`,
      {
        method: Methods.PATCH,
        body: JSON.stringify({ classId }),
      },
    )
  },

  async rejectTransferRequest(requestId: string): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(
      `/${Endpoint.TRANSFERS}/${encodeURIComponent(requestId)}/${Endpoint.REJECT}`,
      {
        method: Methods.PATCH,
      },
    )
  },
}
