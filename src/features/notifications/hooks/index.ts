'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  DispatchNotificationPayload,
  ListNotificationsParams,
  UnreadCountResponse,
} from '../types'
import {
  dispatchNotification,
  listNotifications,
  markAllRead,
  markOneRead,
  unreadCount,
  type ListNotificationsPaginatedResponse,
} from '../api'

type ListSnapshot = [readonly unknown[], ListNotificationsPaginatedResponse | undefined][]

type OptimisticContext = {
  previousLists: ListSnapshot
  previousCount: UnreadCountResponse | undefined
}

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

  return useMutation<{ updated: number }, unknown, void, OptimisticContext>({
    mutationFn: markAllRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all })

      const previousLists = queryClient.getQueriesData<ListNotificationsPaginatedResponse>({
        queryKey: notificationKeys.lists(),
      })
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
      )

      previousLists.forEach(([key, data]) => {
        if (!data) return
        queryClient.setQueryData<ListNotificationsPaginatedResponse>(key, {
          ...data,
          items: data.items.map((n) => (n.isRead ? n : { ...n, isRead: true })),
        })
      })
      queryClient.setQueryData<UnreadCountResponse>(notificationKeys.unreadCount(), { count: 0 })

      return { previousLists, previousCount }
    },
    onError: (_err, _vars, ctx) => {
      ctx?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data))
      if (ctx?.previousCount) {
        queryClient.setQueryData(notificationKeys.unreadCount(), ctx.previousCount)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkOneRead() {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, string, OptimisticContext>({
    mutationFn: markOneRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all })

      const previousLists = queryClient.getQueriesData<ListNotificationsPaginatedResponse>({
        queryKey: notificationKeys.lists(),
      })
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
      )

      let wasUnread = false
      previousLists.forEach(([key, data]) => {
        if (!data) return
        const target = data.items.find((n) => n.id === id)
        if (target && !target.isRead) wasUnread = true
        queryClient.setQueryData<ListNotificationsPaginatedResponse>(key, {
          ...data,
          items: data.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        })
      })

      if (wasUnread && previousCount) {
        queryClient.setQueryData<UnreadCountResponse>(notificationKeys.unreadCount(), {
          count: Math.max(0, previousCount.count - 1),
        })
      }

      return { previousLists, previousCount }
    },
    onError: (_err, _id, ctx) => {
      ctx?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data))
      if (ctx?.previousCount) {
        queryClient.setQueryData(notificationKeys.unreadCount(), ctx.previousCount)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useDispatchNotification() {
  return useMutation({
    mutationFn: (payload: DispatchNotificationPayload) => dispatchNotification(payload),
  })
}
