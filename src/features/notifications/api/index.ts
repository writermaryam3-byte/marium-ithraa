import { api } from '@/lib/api/api'
import { parseResponse } from '@/lib/api/utils'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { PaginationMeta } from '@/lib/types/interfaces'
import type {
  DispatchNotificationPayload,
  DispatchNotificationResponse,
  ListNotificationsParams,
  NotificationItem,
  UnreadCountResponse,
} from '../types'

export type ListNotificationsPaginatedResponse = {
  items: { data: NotificationItem[]; meta: PaginationMeta }
}

const getNotificationsQuery = (params?: ListNotificationsParams) => {
  const qs = new URLSearchParams()

  if (params?.page) {
    qs.set('page', String(params.page))
  }

  if (params?.limit) {
    qs.set('limit', String(params.limit))
  }

  if (typeof params?.unreadOnly === 'boolean') {
    qs.set('unreadOnly', String(params.unreadOnly))
  }

  if (params?.type) {
    qs.set('type', params.type)
  }

  const query = qs.toString()

  return query ? `?${query}` : ''
}

/**
 * Client calls
 */

export const listNotifications = async (
  params?: ListNotificationsParams,
): Promise<ListNotificationsPaginatedResponse> => {
  const query = getNotificationsQuery(params)

  const session = await import('next-auth/react').then((m) => m.getSession())
  const token = session?.user?.accessToken

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${Endpoint.NOTIFICATIONS}${query}`,
    { method: Methods.GET, headers },
  )

  const envelope = await parseResponse<NotificationItem[]>(res)
  return {
    items: envelope.data,
    meta: envelope.meta ?? {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }
}

export const unreadCount = async () => {
  return api.client<UnreadCountResponse>(`/${Endpoint.NOTIFICATIONS}/${Endpoint.UNREAD_COUNT}`, {
    method: Methods.GET,
  })
}

export const markAllRead = async () => {
  return api.client<{ updated: number }>(`/${Endpoint.NOTIFICATIONS}/${Endpoint.READ_ALL}`, {
    method: Methods.PATCH,
  })
}

export const markOneRead = async (id: string) => {
  return api.client<void>(`/${Endpoint.NOTIFICATIONS}/${id}/${Endpoint.READ}`, {
    method: Methods.PATCH,
  })
}

export const dispatchNotification = async (payload: DispatchNotificationPayload) => {
  return api.client<DispatchNotificationResponse>(
    `/${Endpoint.NOTIFICATIONS}/${Endpoint.DISPATCH}`,
    {
      method: Methods.POST,
      body: JSON.stringify(payload),
    },
  )
}

/**
 * Server calls
 */

export const listNotificationsServer = async (
  params?: ListNotificationsParams,
): Promise<ListNotificationsPaginatedResponse> => {
  const query = getNotificationsQuery(params)

  const { getServerSession } = await import('next-auth')
  const { default: nextAuthOptions } = await import('@/server/auth')
  const session = await getServerSession(nextAuthOptions)
  const token = session?.user?.accessToken

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${process.env.BACKEND_URL}/api/${Endpoint.NOTIFICATIONS}${query}`, {
    method: Methods.GET,
    headers,
    cache: 'no-store',
  })

  const envelope = await parseResponse<NotificationItem[]>(res)
  return {
    items: envelope.data,
    meta: envelope.meta ?? {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }
}

export const unreadCountServer = async () => {
  return api.server<UnreadCountResponse>(`/${Endpoint.NOTIFICATIONS}/${Endpoint.UNREAD_COUNT}`, {
    method: Methods.GET,
  })
}
