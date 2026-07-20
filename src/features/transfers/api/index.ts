import { TransferService } from '@/services/TransferService'
import type { ChildTransferRequest } from '@/features/children/types/interfaces'

export const createTransferRequest = (
  payload: { childId: string; childType: 'organization' | 'private'; toOrganizationId: string },
): Promise<ChildTransferRequest> => TransferService.createTransferRequest(payload)

export const getTransferRequests = (fromOrganizationId: string): Promise<ChildTransferRequest[]> =>
  TransferService.getTransferRequests(fromOrganizationId)

export const approveTransferRequest = (
  requestId: string,
  classId: string,
): Promise<ChildTransferRequest> => TransferService.approveTransferRequest(requestId, classId)

export const rejectTransferRequest = (requestId: string): Promise<ChildTransferRequest> =>
  TransferService.rejectTransferRequest(requestId)
