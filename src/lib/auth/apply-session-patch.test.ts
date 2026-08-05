// @vitest-environment node
import type { JWT } from 'next-auth/jwt'
import { describe, expect, it } from 'vitest'

import { applySessionPatch } from '@/lib/auth/apply-session-patch'

describe('applySessionPatch', () => {
  it('updates verification flags and tokens from a session patch', () => {
    const token: JWT = {
      id: 'user-1',
      accessToken: 'old-access',
      refreshToken: 'old-refresh',
      accessTokenExpires: Date.now() + 60_000,
      isEmailVerified: false,
      isPhoneVerified: false,
      roles: [{ id: 'role-1', name: 'PARENT' }],
      phone: '+1234567890',
      name: 'Test User',
      email: 'test@example.com',
    }

    const next = applySessionPatch(token, {
      isEmailVerified: true,
      isPhoneVerified: true,
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      accessTokenExpires: Date.now() + 120_000,
    })

    expect(next.isEmailVerified).toBe(true)
    expect(next.isPhoneVerified).toBe(true)
    expect(next.accessToken).toBe('new-access')
    expect(next.refreshToken).toBe('new-refresh')
    expect(next.accessTokenExpires).toBeGreaterThan(Date.now())
    expect(next.error).toBeUndefined()
  })
})
