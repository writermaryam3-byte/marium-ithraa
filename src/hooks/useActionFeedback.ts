'use client'

import { useTranslations } from 'next-intl'

import {
  isActionFailure,
  isActionSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { normalizeActionMessageKey } from '@/lib/i18n/action-messages'
import { translateBackendMessage } from '@/lib/i18n/backend-messages'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import type { InitialState } from '@/lib/types/types'

function translateActionMessage(
  key: string,
  tActions: ReturnType<typeof useTranslations>,
  tErrors: ReturnType<typeof useTranslations>,
): string {
  const normalized = normalizeActionMessageKey(key)
  if (normalized.startsWith('errors.') || key.startsWith('errors.')) {
    return translateBackendMessage(key, tErrors)
  }
  try {
    const translated = tActions(normalized as 'common.success')
    if (translated !== normalized) return translated
  } catch {
    // fall through
  }
  return translateBackendMessage(key, tErrors)
}

export function useActionFeedback() {
  const tActions = useTranslations('actions')
  const tErrors = useTranslations('errors')

  return {
    notifyAction(state: InitialState) {
      if (isActionSuccess(state) && state.message) {
        showSuccessToast((key) => translateActionMessage(key, tActions, tErrors), state.message)
        return
      }
      if (isActionFailure(state) && state.message) {
        showErrorToast((key) => translateActionMessage(key, tActions, tErrors), state.message)
      }
    },
    notifyDelete(state: DeleteActionResult, successKey = 'common.deleted') {
      if (state.success) {
        showSuccessToast((key) => translateActionMessage(key, tActions, tErrors), successKey)
        return
      }
      if (state.message) {
        showErrorToast((key) => translateActionMessage(key, tActions, tErrors), state.message)
      }
    },
  }
}
