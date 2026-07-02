import { ApiError } from '@/lib/errors/ApiError'
import { StatusCode } from '@/lib/types/enums'

const ORGANIZATION_APPROVAL_MESSAGE =
  'Organization must be approved before performing this operation'

export function isOrganizationApprovalError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false
  if (error.status === StatusCode.FORBIDDEN) {
    return error.message.toLowerCase().includes('approved')
  }
  return false
}

export function getFriendlyApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback
  }

  if (isOrganizationApprovalError(error)) {
    return 'Your organization must be approved before you can perform this action.'
  }

  switch (error.status) {
    case StatusCode.UNAUTHORIZED:
      return 'Your session has expired. Please sign in again.'
    case StatusCode.FORBIDDEN:
      return 'You do not have permission to perform this action.'
    case StatusCode.NOTFOUND:
      return 'The requested resource was not found.'
    case StatusCode.CONFLICT:
      return 'This organization status has already changed. Please refresh.'
    case StatusCode.GONE:
      return 'This flow is no longer available. Please use evaluations instead.'
    default:
      return error.message || fallback
  }
}

export function getFieldValidationError(error: unknown, field: string): string | undefined {
  if (!(error instanceof ApiError) || !error.validationErrors) return undefined

  const direct = error.validationErrors[field]
  if (direct?.[0]) return direct[0]

  if (error.status === StatusCode.BADREQUEST) {
    const nested = error.validationErrors as Record<string, unknown>
    const message = nested.message
    if (typeof message === 'object' && message !== null) {
      const fieldMessage = (message as Record<string, unknown>)[field]
      if (typeof fieldMessage === 'string') return fieldMessage
    }
  }

  return undefined
}

export { ORGANIZATION_APPROVAL_MESSAGE }
