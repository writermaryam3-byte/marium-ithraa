'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { showErrorToast } from '@/lib/toast/app-toast'

import { clearAuthTokenCache } from '@/lib/api/client-api-client'

import { useAuth } from './useAuth'

export function useInitAuth() {
  const locale = useLocale()
  const { status } = useSession()
  const { logout, sessionExpired, session } = useAuth()
  const handledExpiry = useRef(false)
  const hasSyncedToken = useRef(false)

  useEffect(() => {
    if (status === 'loading') return

    if (sessionExpired && session?.user && !handledExpiry.current) {
      handledExpiry.current = true
      clearAuthTokenCache()
      showErrorToast({
        raw:
          locale === 'ar'
            ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.'
            : 'Your session has expired. Please sign in again.',
      })
      void logout({ silent: true })
      return
    }

    if (status === 'authenticated' && !hasSyncedToken.current) {
      hasSyncedToken.current = true
      clearAuthTokenCache()
    }
  }, [locale, status, sessionExpired, session?.user, logout])
}
