// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { applySessionPatch } from '@/lib/auth/apply-session-patch'

describe('applySessionPatch', () => {
  it('updates verification flags and tokens from a session patch', () => {
    const token = {
      accessToken: 'old-access',
      refreshToken: 'old-refresh',
      accessTokenExpires: Date.now() + 60_000,
      isEmailVerified: false,
      isPhoneVerified: false,
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
