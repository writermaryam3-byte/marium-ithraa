import type { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

import { accessTokenExpiresAt, resolveAccessTokenTtlSeconds } from '@/lib/auth/token-expiry'
import { clearAuthTokenCache } from '@/lib/api/client-api-client'

type SessionUpdateFn = (data?: Record<string, unknown>) => Promise<Session | null>

type RefreshResponse = {
  accessToken?: string
  refreshToken?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  expiresIn?: number | string
  expires_in?: number
}

async function refreshBackendSession(refreshToken: string): Promise<RefreshResponse | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) return null

  try {
    const response = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
      cache: 'no-store',
    })

    if (!response.ok) return null

    const body = (await response.json()) as { data?: RefreshResponse } | RefreshResponse
    return ('data' in body && body.data ? body.data : body) as RefreshResponse
  } catch {
    return null
  }
}

/**
 * Reconcile NextAuth session with the backend after email verification.
 * Refreshes backend tokens (source of truth) and patches the NextAuth JWT.
 */
export async function syncSessionAfterEmailVerification(
  update: SessionUpdateFn,
): Promise<boolean> {
  const session = await getSession()
  if (!session?.user?.refreshToken) {
    return false
  }

  const refreshed = await refreshBackendSession(session.user.refreshToken)

  if (refreshed?.accessToken) {
    const ttlSeconds = resolveAccessTokenTtlSeconds(refreshed)
    await update({
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? session.user.refreshToken,
      accessTokenExpires: accessTokenExpiresAt(ttlSeconds),
      isEmailVerified: refreshed.isEmailVerified ?? true,
      isPhoneVerified: refreshed.isPhoneVerified ?? session.user.isPhoneVerified,
    })
  } else {
    await update({ isEmailVerified: true })
  }

  clearAuthTokenCache()
  return true
}

/**
 * Polls the backend profile until email verification is reflected, then syncs session.
 * Used when verification happens in another tab or mail client.
 */
export async function waitForEmailVerificationAndSync(
  update: SessionUpdateFn,
  fetchProfile: () => Promise<{ isEmailVerified: boolean }>,
  options?: { intervalMs?: number; timeoutMs?: number },
): Promise<boolean> {
  const intervalMs = options?.intervalMs ?? 5000
  const timeoutMs = options?.timeoutMs ?? 5 * 60 * 1000
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const profile = await fetchProfile()
      if (profile.isEmailVerified) {
        return syncSessionAfterEmailVerification(update)
      }
    } catch {
      // Ignore transient polling errors.
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  return false
}
