'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DispatchNotificationPayload, ListNotificationsParams } from '../types'
import {
  dispatchNotification,
  listNotifications,
  markAllRead,
  markOneRead,
  unreadCount,
} from '../api'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: ListNotificationsParams) => [...notificationKeys.lists(), params ?? {}] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

export function useUnreadCount(pollMs = 30_000) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: unreadCount,
    refetchInterval: pollMs,
    staleTime: 5_000,
  })
}

export function useNotificationsList(params?: ListNotificationsParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => listNotifications(params),
    staleTime: 10_000,
    placeholderData: (previousData) => previousData,
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      })
    },
  })
}

export function useMarkOneRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markOneRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      })
    },
  })
}

export function useDispatchNotification() {
  return useMutation({
    mutationFn: (payload: DispatchNotificationPayload) => dispatchNotification(payload),
  })
}

export function useNotifications(params?: ListNotificationsParams, options?: { pollMs?: number }) {
  const unread = useUnreadCount(options?.pollMs ?? 30_000)
  const list = useNotificationsList(params)
  const markAll = useMarkAllRead()
  const markOne = useMarkOneRead()

  return {
    unread,
    list,
    markAll,
    markOne,
  }
}
