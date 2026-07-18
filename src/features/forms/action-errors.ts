import { ApiError } from '@/lib/errors/ApiError'
import { StatusCode } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

import { actionFailure, actionValidationFailure } from './action-results'

export function actionErrorState(
  error: unknown,
  formData: FormData | null,
  messages?: {
    conflict?: string
    server?: string
    badRequest?: string
    notFound?: string
    forbidden?: string
    unauthorized?: string
  },
): InitialState {
  if (error instanceof ApiError) {
    if (error.status === StatusCode.BADREQUEST) {
      const fieldErrors: Record<string, string[]> = {}
      for (const fe of error.fieldErrors) {
        if (!fieldErrors[fe.field]) fieldErrors[fe.field] = []
        fieldErrors[fe.field].push(fe.message)
      }
      return actionValidationFailure(
        fieldErrors,
        formData ?? new FormData(),
        messages?.badRequest ?? error.message,
      )
    }
    if (error.status === StatusCode.CONFLICT) {
      return actionFailure(
        messages?.conflict ?? error.message,
        StatusCode.CONFLICT,
        formData,
      )
    }
    if (error.status === StatusCode.NOTFOUND) {
      return actionFailure(
        messages?.notFound ?? error.message,
        StatusCode.NOTFOUND,
        formData,
      )
    }
    if (error.status === StatusCode.FORBIDDEN) {
      return actionFailure(
        messages?.forbidden ?? error.message,
        StatusCode.FORBIDDEN,
        formData,
      )
    }
    if (error.status === StatusCode.UNAUTHORIZED) {
      return actionFailure(
        messages?.unauthorized ?? error.message,
        StatusCode.UNAUTHORIZED,
        formData,
      )
    }
  }

  return actionFailure(
    messages?.server ?? 'errors.common.internalServerError',
    StatusCode.INTERNALSERVERERROR,
    formData,
  )
}
