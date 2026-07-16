import { PaymentService } from '@/services/PaymentService'
import type { CreatePaymentPayload, PaymentResponse } from '@/lib/types/interfaces'
import { parseResponse, unwrapPaginatedList } from '@/lib/api/utils'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { PaginationMeta } from '@/lib/types/interfaces'
import type { AdminPayment, ListAdminPaymentsParams } from '../types/admin'

export const createPayment = (payload: CreatePaymentPayload) =>
  PaymentService.createPayment(payload)

export const initiatePayment = (attemptId: string) => PaymentService.initiatePayment(attemptId)

export const retryPayment = (paymentId: string) => PaymentService.retryPayment(paymentId)

export type ListAdminPaymentsResult = {
  items: AdminPayment[]
  meta: PaginationMeta
}

const buildPaymentsQuery = (params?: ListAdminPaymentsParams) => {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.status) qs.set('status', params.status)
  const query = qs.toString()
  return query ? `?${query}` : ''
}

export const listAdminPayments = async (
  params?: ListAdminPaymentsParams,
): Promise<ListAdminPaymentsResult> => {
  const session = await import('next-auth/react').then((m) => m.getSession())
  const token = session?.user?.accessToken

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${Endpoint.PAYMENTS}${buildPaymentsQuery(params)}`,
    { method: Methods.GET, headers },
  )

  const envelope = await parseResponse<AdminPayment[]>(res)
  return unwrapPaginatedList(envelope)
}
