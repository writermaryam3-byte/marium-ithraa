import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type {
  DispatchNotificationPayload,
  DispatchNotificationResponse,
  ListNotificationsParams,
  ListNotificationsResponse,
  UnreadCountResponse,
} from '../types'

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

export const listNotifications = async (params?: ListNotificationsParams) => {
  const query = getNotificationsQuery(params)

  return api.client<ListNotificationsResponse>(`/${Endpoint.NOTIFICATIONS}${query}`, {
    method: Methods.GET,
  })
}

export const unreadCount = async () => {
  return api.client<UnreadCountResponse>(`/${Endpoint.NOTIFICATIONS}/${Endpoint.UNREAD_COUNT}`, {
    method: Methods.GET,
  })
}

export const markAllRead = async () => {
  return api.client<void>(`/${Endpoint.NOTIFICATIONS}/${Endpoint.READ_ALL}`, {
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

export const listNotificationsServer = async (params?: ListNotificationsParams) => {
  const query = getNotificationsQuery(params)

  return api.server<ListNotificationsResponse>(`/${Endpoint.NOTIFICATIONS}${query}`, {
    method: Methods.GET,
  })
}

export const unreadCountServer = async () => {
  return api.server<UnreadCountResponse>(`/${Endpoint.NOTIFICATIONS}/${Endpoint.UNREAD_COUNT}`, {
    method: Methods.GET,
  })
}
