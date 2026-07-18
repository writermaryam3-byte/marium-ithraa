'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import type { CreatePaymentPayload, PaymentResponse } from '@/lib/types/interfaces'
import { createPayment, initiatePayment, listAdminPayments, retryPayment } from '@/features/payments/api'
import type { ListAdminPaymentsParams } from '@/features/payments/types/admin'

export const adminPaymentKeys = {
  all: ['admin-payments'] as const,
  list: (params?: ListAdminPaymentsParams) => [...adminPaymentKeys.all, params ?? {}] as const,
}

export function useAdminPayments(params?: ListAdminPaymentsParams) {
  return useQuery({
    queryKey: adminPaymentKeys.list(params),
    queryFn: () => listAdminPayments(params),
    staleTime: 10_000,
  })
}

export function useCreatePayment(onSuccess?: (response: PaymentResponse) => void) {
  const t = useTranslations('actions.payments')
  return useMutation({
    mutationFn: createPayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: t('created') })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ error })
    },
  })
}

export function useInitiatePayment(onSuccess?: (response: PaymentResponse) => void) {
  const t = useTranslations('actions.payments')
  return useMutation({
    mutationFn: initiatePayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: t('initiationSucceeded') })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ error })
    },
  })
}

export function useRetryPayment(onSuccess?: (response: PaymentResponse) => void) {
  const t = useTranslations('actions.payments')
  return useMutation({
    mutationFn: retryPayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: t('retrySucceeded') })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ error })
    },
  })
}
