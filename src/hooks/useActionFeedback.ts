'use client'

import { useTranslations } from 'next-intl'

import {
  isActionFailure,
  isActionSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import type { InitialState } from '@/lib/types/types'

export function useActionFeedback() {
  const t = useTranslations('actions')

  return {
    notifyAction(state: InitialState) {
      if (isActionSuccess(state) && state.message) {
        showSuccessToast(t, state.message)
        return
      }
      if (isActionFailure(state) && state.message) {
        showErrorToast(t, state.message)
      }
    },
    notifyDelete(state: DeleteActionResult, successKey = 'actions.common.deleted') {
      if (state.success) {
        showSuccessToast(t, successKey)
        return
      }
      if (state.message) {
        showErrorToast(t, state.message)
      }
    },
  }
}
