import { StatusCode } from '@/lib/types/enums'
import type { InitialState, ValidationErrors } from '@/lib/types/types'

export function validationErrorsToFieldErrors(errors: ValidationErrors): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const [key, messages] of Object.entries(errors)) {
    if (messages?.[0]) fieldErrors[key] = messages[0]
  }
  return fieldErrors
}

export function actionSuccess(
  messageKey: string,
  status: StatusCode = StatusCode.OK,
): InitialState {
  return {
    success: true,
    message: messageKey,
    status,
    error: {},
    fieldErrors: undefined,
    formData: null,
  }
}

export function actionFailure(
  messageKey: string,
  status: StatusCode = StatusCode.INTERNALSERVERERROR,
  formData: FormData | null = null,
): InitialState {
  return {
    success: false,
    message: messageKey,
    status,
    error: {},
    fieldErrors: undefined,
    formData,
  }
}

export function actionValidationFailure(
  errors: ValidationErrors,
  formData: FormData,
  messageKey = 'Actions.common.validationFailed',
): InitialState {
  const fieldErrors = validationErrorsToFieldErrors(errors)
  return {
    success: false,
    message: messageKey,
    fieldErrors,
    error: errors,
    status: StatusCode.BADREQUEST,
    formData,
  }
}

export function isActionSuccess(state: InitialState): boolean {
  if (state.success === true) return true
  return state.status === StatusCode.OK || state.status === StatusCode.CREATED
}

export function isActionFailure(state: InitialState): boolean {
  if (state.success === false) return true
  return (
    state.status === StatusCode.BADREQUEST ||
    state.status === StatusCode.CONFLICT ||
    state.status === StatusCode.INTERNALSERVERERROR ||
    state.status === StatusCode.UNAUTHORIZED
  )
}

export type DeleteActionResult = {
  success: boolean
  message?: string
}

export function deleteSuccess(): DeleteActionResult {
  return { success: true }
}

export function deleteFailure(messageKey: string): DeleteActionResult {
  return { success: false, message: messageKey }
}
