'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Routes, type UserRole } from '@/lib/types/enums'

import { useAuth } from '../hooks/useAuth'
import { AuthLoadingScreen } from './AuthLoadingScreen'

type Props = {
  children: ReactNode
  allowed?: UserRole[]
  redirectTo?: string
  unauthorizedRedirect?: string
}

export function ProtectedRoute({ children, allowed, redirectTo, unauthorizedRedirect }: Props) {
  const router = useRouter()
  const t = useTranslations('auth')
  const { isAuthenticated, isLoading, checkRole, loginPath } = useAuth()
  const unauthorizedPath = unauthorizedRedirect ?? `/${Routes.UNAUTHORIZED}`

  const roleOk = !allowed?.length || checkRole(allowed)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace(redirectTo ?? loginPath)
      return
    }

    if (!roleOk) {
      router.replace(unauthorizedPath)
    }
  }, [isAuthenticated, isLoading, roleOk, router, redirectTo, loginPath, unauthorizedPath])

  if (isLoading) {
    return <AuthLoadingScreen label={t('checking')} />
  }

  if (!isAuthenticated || !roleOk) {
    return <AuthLoadingScreen label={t('redirecting')} />
  }

  return <>{children}</>
}
