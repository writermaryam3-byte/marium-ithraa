import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { CreatePaymentPayload, PaymentResponse } from '@/lib/types/interfaces'

export const PaymentService = {
  async createPayment(payload: CreatePaymentPayload): Promise<PaymentResponse> {
    return api.client<PaymentResponse>(`/${Endpoint.PAYMENTS}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
  },

  async initiatePayment(attemptId: string): Promise<PaymentResponse> {
    return api.client<PaymentResponse>(
      `/${Endpoint.PAYMENTS}/${encodeURIComponent(attemptId)}/${Endpoint.INITIATE}`,
      {
        method: Methods.POST,
      },
    )
  },

  async retryPayment(paymentId: string): Promise<PaymentResponse> {
    return api.client<PaymentResponse>(
      `/${Endpoint.PAYMENTS}/${encodeURIComponent(paymentId)}/${Endpoint.RETRY}`,
      {
        method: Methods.POST,
      },
    )
  },
}
