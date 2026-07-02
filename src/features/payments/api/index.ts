import { PaymentService } from '@/services/PaymentService'
import type { CreatePaymentPayload, PaymentResponse } from '@/lib/types/types/interfaces'

export const createPayment = (payload: CreatePaymentPayload) =>
  PaymentService.createPayment(payload)

export const initiatePayment = (attemptId: string) => PaymentService.initiatePayment(attemptId)

export const retryPayment = (paymentId: string) => PaymentService.retryPayment(paymentId)
