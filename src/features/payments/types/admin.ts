export type AdminPayment = {
  id: string
  userId: string
  userEmail: string | null
  userName: string | null
  amount: string
  currency: string
  status: string
  provider: string
  purpose: string | null
  capacityRequestId: string | null
  paymentUrl: string | null
  providerPaymentId: string | null
  createdAt: string
  expiresAt: string
  updatedAt: string
}

export type ListAdminPaymentsParams = {
  page?: number
  limit?: number
  status?: string
}
