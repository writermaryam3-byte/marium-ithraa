'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'

import { getFriendlyApiErrorMessage } from '@/lib/helpers/apiErrorMessages'
import { StatusCode } from '@/lib/types/enums'

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
}) {
  const t = useTranslations('children.create')
  const tApiErrors = useTranslations('errors')
  const tb = useTranslateBackend()
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [isPending, startTransition] = useTransition()

  function createChild(payload: CreateChildFlowPayload) {
    setRequestState('loading')

    startTransition(async () => {
      try {
        const response = await createChildFlow(payload)

        if (response.status === 'CREATED') {
          setRequestState('success')
          showSuccessToast({ raw: tb(response.message) })
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
        const message = err instanceof Error ? err.message : t('toast.unableToCreateChild')

        if (status === 409) {
          showErrorToast({ raw: message || tApiErrors('childExists') })
          options?.onConflict?.(message || 'Child already exists in your school')
          return
        }

        if (status === StatusCode.FORBIDDEN) {
          showErrorToast({ raw: getFriendlyApiErrorMessage(err) })
          return
        }

        showErrorToast({ raw: getFriendlyApiErrorMessage(err, message) })
      }
    })
  }

  return {
    createChild,
    requestState,
    isLoading: requestState === 'loading' || isPending,
  }
}
// export function useCreateChild(options?:{
//     onCreated?: (response: Extract<CreateChildResponse, { type: "CREATED" }>) => void
//     onTransferRequired?: (
//       response: Extract<CreateChildResponse, { type: "TRANSFER_REQUIRED" }>,
//     ) => void
//     onConflict?: (message: string) => void
//   }) {
//   const [requestState, setRequestState] = useState<RequestState>("idle")
//   const [isPending, startTransition] = useTransition()

//   function createChild(payload: CreateChildFlowPayload) {
//     setRequestState("loading")

//     startTransition(async () => {
//       try {
//         const response = await createChildFlow(payload)

//         // تذكر: الـ Backend يرسل "status" وليس "type"
//         if (response.status === "CREATED") {
//           setRequestState("success")
//           showSuccessToast({ raw: response.message })
//           options?.onCreated?.(response)
//           return
//         }

//         if (response.status === "TRANSFER_REQUIRED") {
//           setRequestState("success")
//           options?.onTransferRequired?.(response)
//           return
//         }

//         setRequestState("idle")
//       } catch (err) {
//         // ... باقي كود الـ catch كما هو بدون تغيير
//       }
//     })
//   }

//   return {
//     createChild,
//     requestState,
//     isLoading: requestState === "loading" || isPending,
//   }
// }
