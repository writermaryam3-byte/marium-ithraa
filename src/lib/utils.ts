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
        Authorization: `Bearer ${token.refreshToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.refreshToken,
      }),
      cache: 'no-store',
    })

    const refreshedTokens = (await response.json().catch(() => ({}))) as {
      accessToken?: string
      refreshToken?: string
      expiresIn?: number
      expires_in?: number
    }

    if (!response.ok || !refreshedTokens.accessToken) {
      throw refreshedTokens
    }

    const ttlSeconds = resolveAccessTokenTtlSeconds(refreshedTokens)

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: accessTokenExpiresAt(ttlSeconds),
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
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
