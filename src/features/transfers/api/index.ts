import { TransferService } from '@/services/TransferService'
import type { TransferRequest, TransferRequestPayload } from '@/lib/types/types/interfaces'
import type { TransferRequestResponse } from '@/features/children'

export const createTransferRequest = (
  payload: TransferRequestPayload,
): Promise<TransferRequestResponse> => TransferService.createTransferRequest(payload)

export const getTransferRequests = (fromOrganizationId: string): Promise<TransferRequest[]> =>
  TransferService.getTransferRequests(fromOrganizationId)

export const approveTransferRequest = (
  requestId: string,
  classId: string,
): Promise<TransferRequestResponse> => TransferService.approveTransferRequest(requestId, classId)

export const rejectTransferRequest = (requestId: string): Promise<TransferRequestResponse> =>
  TransferService.rejectTransferRequest(requestId)
