import type { Session } from 'next-auth'

import type { AuthUser } from '../types'

export function mapSessionToAuthUser(session: Session | null | undefined): AuthUser | null {
  const user = session?.user
  if (!user?.id || !user.accessToken) return null

  return {
    id: user.id,
    name: user.name ?? user.phone ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    roles: user.roles ?? [],
    accessToken: user.accessToken,
    isEmailVerified: Boolean(user.isEmailVerified),
    isPhoneVerified: Boolean(user.isPhoneVerified),
  }
}
