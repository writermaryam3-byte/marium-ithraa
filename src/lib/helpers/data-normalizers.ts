import { Child } from '@/features/children'
import { EvaluationAttempt, PaymentResponse, TransferRequest } from '@/lib/types/interfaces'

export function normalizeChild(child: Partial<Child> | null | undefined): Child | undefined {
  if (!child) {
    return undefined
  }

  return {
    ...child,
    parentUserId: child.parentUserId ?? child.parent?.userId,
  } as Child
}

export function normalizeEvaluationAttempt(attempt: EvaluationAttempt): EvaluationAttempt {
  return {
    ...attempt,
    parentUserId:
      attempt.parentUserId ?? (attempt.parent as { userId?: string } | undefined)?.userId,
  }
}

export function normalizePaymentResponse(response: PaymentResponse): PaymentResponse {
  return {
    ...response,
  }
}

export function normalizeTransferRequest(request: TransferRequest): TransferRequest {
  return {
    ...request,
  }
}
