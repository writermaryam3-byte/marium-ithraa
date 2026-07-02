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
  },
): InitialState {
  if (error instanceof ApiError) {
    if (error.status === StatusCode.BADREQUEST) {
      return actionValidationFailure(
        error.validationErrors ?? {},
        formData ?? new FormData(),
        messages?.badRequest ?? 'Actions.common.validationFailed',
      )
    }
    if (error.status === StatusCode.CONFLICT) {
      return actionFailure(
        messages?.conflict ?? 'Actions.common.conflict',
        StatusCode.CONFLICT,
        formData,
      )
    }
  }

  return actionFailure(
    messages?.server ?? 'Actions.common.serverError',
    StatusCode.INTERNALSERVERERROR,
    formData,
  )
}
