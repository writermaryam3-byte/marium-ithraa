'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'

import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { getFriendlyApiErrorMessage } from '@/lib/helpers/apiErrorMessages'
import type { CreatePaymentPayload, PaymentResponse } from '@/lib/types/types/interfaces'
import { createPayment, initiatePayment, retryPayment } from '@/features/payments/api'

export function useCreatePayment(onSuccess?: (response: PaymentResponse) => void) {
  const t = useTranslations('actions.payments')
  const tb = useTranslateBackend()
  return useMutation({
    mutationFn: createPayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: t('created') })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: tb(getFriendlyApiErrorMessage(error)) })
    },
  })
}

export function useInitiatePayment(onSuccess?: (response: PaymentResponse) => void) {
  const t = useTranslations('actions.payments')
  const tb = useTranslateBackend()
  return useMutation({
    mutationFn: initiatePayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: t('initiationSucceeded') })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: tb(getFriendlyApiErrorMessage(error)) })
    },
  })
}

export function useRetryPayment(onSuccess?: (response: PaymentResponse) => void) {
  const t = useTranslations('actions.payments')
  const tb = useTranslateBackend()
  return useMutation({
    mutationFn: retryPayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: t('retrySucceeded') })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: tb(getFriendlyApiErrorMessage(error)) })
    },
  })
}
