import type { JWT } from 'next-auth/jwt'

type SessionPatch = Record<string, unknown>

export function applySessionPatch(token: JWT, session: SessionPatch): JWT {
  const next: JWT = { ...token }

  if (session.isEmailVerified === true) {
    next.isEmailVerified = true
  }

  if (typeof session.isPhoneVerified === 'boolean') {
    next.isPhoneVerified = session.isPhoneVerified
  }

  if (typeof session.accessToken === 'string') {
    next.accessToken = session.accessToken
  }

  if (typeof session.refreshToken === 'string') {
    next.refreshToken = session.refreshToken
  }

  if (typeof session.accessTokenExpires === 'number' && Number.isFinite(session.accessTokenExpires)) {
    next.accessTokenExpires = session.accessTokenExpires
  }

  next.error = undefined
  return next
}
