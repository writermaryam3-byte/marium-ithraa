import { ApiError } from '@/lib/errors/ApiError'
import { StatusCode } from '@/lib/types/enums'

export function isOrganizationApprovalError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false
  return error.status === StatusCode.FORBIDDEN
}

export function getFriendlyApiErrorMessage(
  error: unknown,
  fallback = 'errors.common.internalServerError',
): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback
  }

  return error.message || fallback
}

export function getFieldError(error: unknown, field: string): string | undefined {
  if (!(error instanceof ApiError)) return undefined

  const fieldError = error.fieldErrors.find((fe) => fe.field === field)
  if (fieldError) return fieldError.message

  return undefined
}

export function getAllFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {}

  const fieldErrors: Record<string, string> = {}
  for (const fe of error.fieldErrors) {
    fieldErrors[fe.field] = fe.message
  }
  return fieldErrors
}

export function hasErrorCode(error: unknown, code: string): boolean {
  if (!(error instanceof ApiError)) return false
  return error.code === code
}
