'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'

import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { getFriendlyApiErrorMessage } from '@/lib/helpers/apiErrorMessages'
import type { TransferRequest, TransferRequestPayload } from '@/lib/types/types/interfaces'
import {
  approveTransferRequest,
  createTransferRequest,
  getTransferRequests,
  rejectTransferRequest,
} from '@/features/transfers/api'

export function useTransferRequests(
  fromOrganizationId: string,
  options?: {
    enabled?: boolean
  },
) {
  return useQuery<TransferRequest[], Error>({
    queryKey: ['transferRequests', fromOrganizationId],
    queryFn: () => getTransferRequests(fromOrganizationId),
    enabled: options?.enabled ?? Boolean(fromOrganizationId),
  })
}

export function useCreateTransferRequest(onSuccess?: () => void) {
  const t = useTranslations('actions.transfers')
  const tb = useTranslateBackend()
  return useMutation({
    mutationFn: createTransferRequest,
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('requestCreated') })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: tb(getFriendlyApiErrorMessage(error)) })
    },
  })
}

export function useApproveTransferRequest(onSuccess?: () => void) {
  const t = useTranslations('actions.transfers')
  const tb = useTranslateBackend()
  return useMutation({
    mutationFn: ({ requestId, classId }: { requestId: string; classId: string }) =>
      approveTransferRequest(requestId, classId),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('approved') })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: tb(getFriendlyApiErrorMessage(error)) })
    },
  })
}

export function useRejectTransferRequest(onSuccess?: () => void) {
  const t = useTranslations('actions.transfers')
  const tb = useTranslateBackend()
  return useMutation({
    mutationFn: rejectTransferRequest,
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('rejected') })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: tb(getFriendlyApiErrorMessage(error)) })
    },
  })
}
