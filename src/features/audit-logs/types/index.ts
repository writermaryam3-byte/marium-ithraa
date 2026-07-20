export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'TRANSFER_REQUEST'
  | 'TRANSFER_APPROVE'
  | 'TRANSFER_REJECT'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILURE'
  | 'EVALUATION_START'
  | 'EVALUATION_SUBMIT'
  | 'EVALUATION_APPROVE'
  | 'DEAL_CREATE'
  | 'DEAL_SELECT'
  | 'DEAL_APPROVE'
  | 'ORGANIZATION_APPROVE'
  | 'ORGANIZATION_REJECT'

export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  userRole: string
  action: AuditAction | string
  entityType: string
  entityId: string
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  description: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export type ListAuditLogsParams = {
  page?: number
  limit?: number
  entityType?: string
  entityId?: string
  userId?: string
  action?: string
}
