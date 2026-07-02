'use client'

import type { ListNotificationsParams } from '../types'
import { useMarkAllRead, useMarkOneRead, useNotificationsList, useUnreadCount } from './index'

export function useNotifications(params: ListNotificationsParams, options?: { pollMs?: number }) {
  const unread = useUnreadCount(options?.pollMs ?? 30_000)
  const list = useNotificationsList(params)
  const markAll = useMarkAllRead()
  const markOne = useMarkOneRead()

  return { unread, list, markAll, markOne }
}
