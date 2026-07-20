import { AuthOptions, DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { Environments, Pages, Routes } from '@/lib/types/enums'
import { accessTokenExpiresAt, resolveAccessTokenTtlSeconds } from '@/lib/auth/token-expiry'
import { refreshAccessToken } from '@/lib/utils'
import { Role } from '@/features/users'
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string
      phone: string
      email: string
      roles: Role[]
      accessToken: string
      refreshToken: string
      isEmailVerified: boolean
      isPhoneVerified: boolean
    }
    error?: 'RefreshAccessTokenError'
  }

  interface User {
    id: string
    phone: string
    name: string
    email: string
    roles: Role[]
    accessToken: string
    refreshToken: string
    expiresIn: number
    isEmailVerified: boolean
    isPhoneVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    roles: Role[]
    phone: string
    name: string
    email: string
    isEmailVerified: boolean
    isPhoneVerified: boolean
    error?: 'RefreshAccessTokenError'
  }
}

const nextAuthOptions: AuthOptions = {
  callbacks: {
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        session.error = 'RefreshAccessTokenError'
        return session
      }

      if (!token?.id) {
        return session
      }

      session.user = {
        ...session.user,
        id: token.id,
        roles: token.roles,
        accessToken: token.accessToken,
        phone: token.phone,
        email: token.email,
        name: token.name ?? token.phone,
        refreshToken: token.refreshToken,
        isEmailVerified: token.isEmailVerified,
        isPhoneVerified: token.isPhoneVerified,
      }

      return session
    },
    async jwt({ token, user, trigger, session }) {
      // أول login
      if (user) {
        const ttlSeconds = resolveAccessTokenTtlSeconds(user)
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: accessTokenExpiresAt(ttlSeconds),
          roles: user.roles,
          phone: user.phone,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          error: undefined,
        }
      }

      if (trigger === 'update' && session?.isEmailVerified === true) {
        token.isEmailVerified = true
        return token
      }

      if (token.error === 'RefreshAccessTokenError') {
        return token
      }

      const expiresAt =
        typeof token.accessTokenExpires === 'number' && Number.isFinite(token.accessTokenExpires)
          ? token.accessTokenExpires
          : 0

      if (expiresAt > Date.now()) {
        return token
      }

      return refreshAccessToken(token)
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === Environments.DEV,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        phone: { label: 'phone', type: 'text', placeholder: '+0125546262615' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const apiBaseUrl = process.env.BACKEND_URL
          if (!apiBaseUrl) return null

          const payload = {
            phone: credentials?.phone,
            password: credentials?.password,
          }

          const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          })
          if (!res.ok) return null

          const responseJson = await res.json()
          const user = responseJson.data
          const expiresIn = resolveAccessTokenTtlSeconds(user)
          return { ...user, expiresIn }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
}

export default nextAuthOptions
