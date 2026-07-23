import { clsx, type ClassValue } from 'clsx'
import type { JWT } from 'next-auth/jwt'
import { twMerge } from 'tailwind-merge'

import { accessTokenExpiresAt, resolveAccessTokenTtlSeconds } from '@/lib/auth/token-expiry'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return { ...token, error: 'RefreshAccessTokenError' }
  }

  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[auth] BACKEND_URL is not configured')
    }
    return { ...token, error: 'RefreshAccessTokenError' }
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.refreshToken,
      }),
      cache: 'no-store',
    })

    const responseJson = (await response.json().catch(() => ({}))) as Record<string, unknown>

    if (!response.ok) {
      throw responseJson
    }

    const envelope = responseJson as {
      success?: boolean
      data?: {
        accessToken?: string
        refreshToken?: string
        expiresIn?: number | string
        expires_in?: number
      }
    }

    const payload = (envelope.data ?? responseJson) as {
      accessToken?: string
      refreshToken?: string
      expiresIn?: number | string
      expires_in?: number
      isEmailVerified?: boolean
      isPhoneVerified?: boolean
    }

    if (!payload.accessToken) {
      throw payload
    }

    const ttlSeconds = resolveAccessTokenTtlSeconds(payload)

    return {
      ...token,
      accessToken: payload.accessToken,
      accessTokenExpires: accessTokenExpiresAt(ttlSeconds),
      refreshToken: payload.refreshToken ?? token.refreshToken,
      isEmailVerified: payload.isEmailVerified ?? token.isEmailVerified,
      isPhoneVerified: payload.isPhoneVerified ?? token.isPhoneVerified,
      error: undefined,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[auth] refreshAccessToken failed', error)
    }
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
