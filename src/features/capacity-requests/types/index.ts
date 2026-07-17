export type CapacityRequestStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'completed'

export interface CapacityRequestParent {
  id: string
  userId: string
  user?: {
    id: string
    name: string
    phone: string
    email?: string
  }
}

export interface CapacityRequest {
  id: string
  requestedCapacity: number
  notes?: string | null
  status: CapacityRequestStatus
  parentId: string
  parent?: CapacityRequestParent
  paymentId?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCapacityRequestPayload {
  requestedCapacity: number
  notes?: string
}

export interface UpdateCapacityRequestPayload {
  status?: CapacityRequestStatus
  notes?: string
}

export interface ApproveCapacityRequestResult {
  capacityRequest: CapacityRequest
  payment: {
    id: string
    checkoutUrl: string
    expiresAt: string
  }
}

export interface PaymentSessionResult {
  id: string
  checkoutUrl: string
  expiresAt: string
  status: string
}
