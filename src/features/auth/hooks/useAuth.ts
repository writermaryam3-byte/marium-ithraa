'use client'

import { useCallback, useMemo } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { showInfoToast } from '@/lib/toast/app-toast'

import { logoutClient } from '@/features/auth/api'
import { clearAuthTokenCache } from '@/lib/api/client-api-client'
import { Pages, Routes, UserRole } from '@/lib/types/enums'

import type { AuthUser, SignInCredentials } from '../types'
import { hasAnyRole } from '../utils/rbac'
import { getLoginPath, getPostLoginRedirect } from '../utils/redirects'
import { mapSessionToAuthUser } from '../utils/session-user'

export function useAuth() {
  const locale = useLocale()
  const { data: session, status, update } = useSession()

  const isLoading = status === 'loading'
  const sessionExpired = session?.error === 'RefreshAccessTokenError'
  const isAuthenticated = status === 'authenticated' && Boolean(session?.user) && !sessionExpired

  const user = useMemo<AuthUser | null>(() => {
    if (!isAuthenticated) return null
    return mapSessionToAuthUser(session)
  }, [isAuthenticated, session])

  const setUser = useCallback(async () => {
    clearAuthTokenCache()
    await update()
  }, [update])

  const clearUser = useCallback(() => {
    clearAuthTokenCache()
  }, [])

  const login = useCallback(
    async (credentials: SignInCredentials) => {
      clearAuthTokenCache()

      const result = await signIn('credentials', {
        phone: credentials.phone,
        password: credentials.password,
        redirect: false,
      })

      if (!result?.ok) {
        return {
          ok: false as const,
          error: result?.error ?? 'INVALID_CREDENTIALS',
        }
      }

      await update()
      return { ok: true as const }
    },
    [update],
  )

  const logout = useCallback(
    async (options?: { callbackUrl?: string; silent?: boolean }) => {
      clearAuthTokenCache()

      try {
        await logoutClient()
      } catch {
        // still clear local session if backend logout fails
      }

      const callbackUrl = options?.callbackUrl ?? getLoginPath()

      await signOut({ callbackUrl, redirect: true })

      if (!options?.silent) {
        showInfoToast({ raw: locale === 'ar' ? 'تم تسجيل الخروج' : 'Signed out' })
      }
    },
    [locale],
  )

  const checkRole = useCallback(
    (allowed: UserRole[]) => hasAnyRole(user?.roles, allowed),
    [user?.roles],
  )

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    sessionExpired,
    login,
    logout,
    setUser,
    clearUser,
    updateSession: update,
    checkRole,
    getRedirectAfterLogin: () =>
      getPostLoginRedirect(user?.roles, {
        isEmailVerified: user?.isEmailVerified,
        locale,
      }),
    loginPath: getLoginPath(),
    choseRolePath: `/${locale}/${Routes.CHOSEROLE}`,
    signupPath: `/${Routes.AUTH}/${Pages.BENEFICIARYSIGNUP}`,
  }
}
