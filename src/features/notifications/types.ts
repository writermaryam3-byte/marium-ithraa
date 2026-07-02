export type NotificationDelivery = 'email' | 'inapp' | 'both' | 'verify_email'

export type NotificationType =
  | 'general'
  | 'evaluation_submitted'
  | 'evaluation_approved'
  | 'evaluation_limit_reached'
  | 'evaluation_reminder'
  | 'payment_required'
  | 'payment_success'
  | 'account'
  | string

export type NotificationMetadata = Record<string, unknown> | null

export type NotificationItem = {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  metadata: NotificationMetadata
  isRead: boolean
  createdAt: string
}

export type ListNotificationsParams = {
  page?: number
  limit?: number
  unreadOnly?: boolean
  type?: string
}

export type ListNotificationsResponse = {
  data: NotificationItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UnreadCountResponse = {
  count: number
}

export type DispatchNotificationPayload = {
  delivery: NotificationDelivery
  userId: string
  email?: string
  title: string
  message: string
  type?: NotificationType
  metadata?: Record<string, unknown> | null
}

export type DispatchNotificationResponse = {
  jobId: string | number
}
