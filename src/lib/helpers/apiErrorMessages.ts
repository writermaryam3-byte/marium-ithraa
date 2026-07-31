import { ApiError } from '@/lib/errors/ApiError'
import { translateApiKey } from '@/lib/i18n/client-translator'
import { StatusCode } from '@/lib/types/enums'

export function isOrganizationApprovalError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false
  return error.status === StatusCode.FORBIDDEN
}

/** Resolve a backend translation key (or ApiError) to localized UI text. */
export function resolveApiErrorMessage(
  error: unknown,
  fallback = 'errors.common.internalServerError',
): string {
  if (error instanceof ApiError) {
    return translateApiKey(error.message || fallback)
  }

  if (error instanceof Error && error.message) {
    return translateApiKey(error.message)
  }

  if (typeof error === 'string') {
    return translateApiKey(error)
  }

  return translateApiKey(fallback)
}

export function getFriendlyApiErrorMessage(
  error: unknown,
  fallback = 'errors.common.internalServerError',
): string {
  return resolveApiErrorMessage(error, fallback)
}

export function translateFieldErrorMessage(message: string): string {
  return translateApiKey(message)
}

export function getFieldError(error: unknown, field: string): string | undefined {
  if (!(error instanceof ApiError)) return undefined

  const fieldError = error.fieldErrors.find((fe) => fe.field === field)
  if (fieldError) return translateFieldErrorMessage(fieldError.message)

  return undefined
}

export function getAllFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {}

  const fieldErrors: Record<string, string> = {}
  for (const fe of error.fieldErrors) {
    fieldErrors[fe.field] = translateFieldErrorMessage(fe.message)
  }
  return fieldErrors
}

export function hasErrorCode(error: unknown, code: string): boolean {
  if (!(error instanceof ApiError)) return false
  return error.code === code
}

export function applyApiFieldErrors<TField extends string>(
  error: unknown,
  setError: (field: TField, error: { message: string }) => void,
): void {
  if (!(error instanceof ApiError)) return

  for (const fe of error.fieldErrors) {
    if (!fe.message) continue
    setError(fe.field as TField, { message: translateFieldErrorMessage(fe.message) })
  }
}
