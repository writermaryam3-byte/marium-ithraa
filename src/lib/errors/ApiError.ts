import type { ApiErrorCodes } from '../types/enums'
import type { FieldError } from '../types/interfaces'

export class ApiError extends Error {
  status: number
  path: string
  code: ApiErrorCodes | string
  details?: Record<string, unknown>
  fieldErrors: FieldError[]
  requestId?: string
  timestamp?: string

  constructor(
    path: string,
    status: number,
    error: {
      code: ApiErrorCodes | string
      message: string
      details?: Record<string, unknown>
      fieldErrors?: FieldError[]
      requestId?: string
      timestamp?: string
    },
  ) {
    super(error.message)
    this.name = 'ApiError'
    this.status = status
    this.path = path
    this.code = error.code
    this.details = error.details
    this.fieldErrors = error.fieldErrors ?? []
    this.requestId = error.requestId
    this.timestamp = error.timestamp
  }
}
