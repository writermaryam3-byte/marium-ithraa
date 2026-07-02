import { getSession } from 'next-auth/react'

import { getPostLoginRedirect } from '@/features/auth/utils/redirects'

type PushFn = (href: string) => void

type LoginFn = (credentials: {
  phone: string
  password: string
}) => Promise<{ ok: boolean; error?: string }>

export async function signInWithPhoneAndRedirect({
  phone,
  password,
  push,
  login,
}: {
  phone: string
  password: string
  push: PushFn
  login: LoginFn
  locale?: string
}) {
  const result = await login({ phone, password })

  if (!result.ok) {
    return { ok: false as const, error: result.error ?? 'INVALID_CREDENTIALS' }
  }

  const session = await getSession()
  if (!session?.user) {
    return { ok: false as const, error: 'NO_SESSION' }
  }

  const href = getPostLoginRedirect(session.user.roles, {
    isEmailVerified: session.user.isEmailVerified,
  })

  push(href)
  return { ok: true as const }
}
