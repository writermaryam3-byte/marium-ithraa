import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next-auth/react', () => ({
  getSession: vi.fn().mockResolvedValue(null),
  signOut: vi.fn(),
}))

vi.mock('@/lib/i18n/pathname', () => ({
  getLocaleFromWindowPathname: vi.fn().mockReturnValue('en'),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  metrics: {
    incrementRetry: vi.fn(),
    incrementFailed: vi.fn(),
  },
}))

import { clientApiFetch } from './client-api-client'

describe('clientApiFetch locale propagation', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', 'http://backend.test')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: { ok: true },
            requestId: 'request-1',
            timestamp: new Date(0).toISOString(),
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    )
  })

  it('sends the active route locale to the backend', async () => {
    await clientApiFetch('/auth/parent-signup', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://backend.test/api/auth/parent-signup',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept-Language': 'en',
        }),
      }),
    )
  })
})
