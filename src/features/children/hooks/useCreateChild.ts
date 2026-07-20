'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { StatusCode } from '@/lib/types/enums'
import { ApiError } from '@/lib/errors/ApiError'

import { createChildFlow } from '@/features/children/api'
import type {
  CreateChildFlowPayload,
  CreateChildResponse,
} from '@/features/children/types/interfaces'

type RequestState = 'idle' | 'loading' | 'success'

export function useCreateChild(options?: {
  onCreated?: (response: Extract<CreateChildResponse, { status: 'CREATED' }>) => void
  onTransferRequired?: (
    response: Extract<CreateChildResponse, { status: 'TRANSFER_REQUIRED' }>,
  ) => void
  onConflict?: (message: string) => void
  onRoleConfirmationRequired?: () => void
}) {
  const t = useTranslations('children.create')
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [isPending, startTransition] = useTransition()

  function createChild(payload: CreateChildFlowPayload) {
    setRequestState('loading')

    startTransition(async () => {
      try {
        const response = await createChildFlow(payload)

        if (response.status === 'CREATED') {
          setRequestState('success')
          showSuccessToast({ raw: t('childCreatedSuccess') })
          options?.onCreated?.(response)
          return
        }

        if (response.status === 'TRANSFER_REQUIRED') {
          setRequestState('success')
          options?.onTransferRequired?.(response)
          return
        }

        setRequestState('idle')
      } catch (err) {
        setRequestState('idle')
        const status =
          typeof err === 'object' && err !== null && 'status' in err
            ? Number((err as { status: unknown }).status)
            : undefined

        if (status === 409) {
          showErrorToast({ error: err })
          options?.onConflict?.('errors.child.duplicate')
          return
        }

        if (status === StatusCode.FORBIDDEN) {
          showErrorToast({ error: err })
          return
        }

        if (
          err instanceof ApiError &&
          err.code === 'PARENT.ROLE_CONFIRMATION_REQUIRED'
        ) {
          options?.onRoleConfirmationRequired?.()
          return
        }

        showErrorToast({ error: err })
      }
    })
  }

  return {
    createChild,
    requestState,
    isLoading: requestState === 'loading' || isPending,
  }
}
