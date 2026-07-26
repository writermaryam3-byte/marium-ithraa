import { Bell, ClipboardCheck, CreditCard, MessageCircle, type LucideIcon } from 'lucide-react'

import type { NotificationItem, NotificationMetadata } from '@/features/notifications/types'
import { toAppPath } from '@/lib/i18n/pathname'

export function getNotificationHref(metadata: NotificationMetadata): string | null {
  if (!metadata || typeof metadata !== 'object') return null

  for (const key of ['url', 'href', 'path'] as const) {
    const value = metadata[key]
    if (typeof value === 'string' && value.trim()) {
      return toAppPath(value.trim())
    }
  }

  return null
}

export function formatNotificationDate(createdAt: string, locale: string): string {
  try {
    return new Date(createdAt).toLocaleString(locale === 'ar' ? 'ar-SA' : undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return createdAt
  }
}

export function isEvaluationNotificationType(type?: string): boolean {
  if (!type) return false
  return type.startsWith('evaluation')
}

export function isPaymentNotificationType(type?: string): boolean {
  if (!type) return false
  return type.startsWith('payment')
}

export function filterNotificationsByCategory(
  items: NotificationItem[],
  category: string,
): NotificationItem[] {
  if (!category || category === 'all') return items

  if (category === 'evaluations') {
    return items.filter((n) => isEvaluationNotificationType(n.type))
  }

  if (category === 'reminders') {
    return items.filter((n) => n.type === 'evaluation_reminder')
  }

  if (category === 'payment') {
    return items.filter((n) => isPaymentNotificationType(n.type))
  }

  if (category === 'general') {
    return items.filter((n) => !n.type || n.type === 'general' || n.type === 'account')
  }

  return items
}

export function getNotificationTypeIcon(type?: string): LucideIcon {
  if (!type) return Bell
  if (type.startsWith('evaluation')) return ClipboardCheck
  if (type.startsWith('payment')) return CreditCard
  if (type === 'evaluation_reminder') return MessageCircle
  return Bell
}

export function getApiTypeFilter(category: string): string | undefined {
  if (category === 'reminders') return 'evaluation_reminder'
  if (category === 'payment') return 'payment_required'
  if (category === 'general') return 'general'
  return undefined
}
