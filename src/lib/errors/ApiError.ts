import { ApiErrorCodes } from '../types/enums'

export interface FieldError {
  field: string
  message: string
  code: string
  context?: Record<string, unknown>
}

export class ApiError extends Error {
  status: number
  path: string
  code: ApiErrorCodes
  details?: Record<string, unknown>
  fieldErrors: FieldError[]
  requestId?: string
  timestamp?: string

  constructor(
    path: string,
    status: number,
    error: {
      code: ApiErrorCodes
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
