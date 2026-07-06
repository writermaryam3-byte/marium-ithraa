import { ApiErrorCodes } from '../types/enums'

export class ApiError extends Error {
  status: number
  path: string
  error: {
    code: ApiErrorCodes
    message: string
    details?: Record<string, unknown>
  }

  constructor(
    path: string,
    status: number,
    error: {
      code: ApiErrorCodes
      message: string
      details?: Record<string, unknown>
    },
  ) {
    super(error.message)
    this.status = status
    this.path = path
    this.error = error
  }
}
