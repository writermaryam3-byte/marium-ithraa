'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'

import type { UserRole } from '@/lib/types/enums'

import { useAuth } from './useAuth'

/**
 * Client-side RBAC convenience hook.
 * Server RBAC (layouts/pages) should still be used for real route protection.
 */
export function useRBAC(
  allowed: UserRole[],
  options?: { redirectTo?: string; requireAuth?: boolean },
) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, checkRole, loginPath } = useAuth()

  const ok = useMemo(
    () => isAuthenticated && checkRole(allowed),
    [allowed, checkRole, isAuthenticated],
  )

  useEffect(() => {
    if (isLoading) return
    const requireAuth = options?.requireAuth ?? true

    if (requireAuth && !isAuthenticated) {
      router.replace(options?.redirectTo ?? loginPath)
      return
    }

    if (isAuthenticated && !ok) {
      router.replace(options?.redirectTo ?? '/unauthorized')
    }
  }, [isAuthenticated, isLoading, ok, options?.redirectTo, options?.requireAuth, router, loginPath])

  return { ok, isLoading, isAuthed: isAuthenticated, user }
}
