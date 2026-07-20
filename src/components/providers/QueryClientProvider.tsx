'use client'

import { useEffect, useMemo } from 'react'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { AuthInit } from '@/features/auth/components/AuthInit'
import { ApiError } from '@/lib/errors/ApiError'
import { setApiErrorsTranslator, normalizeErrorKey } from '@/lib/i18n/client-translator'
import { notifyError, notifySuccess } from '@/lib/toast/app-toast'
import { TooltipProvider } from '../ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  const t = useTranslations('errors')
  const tActions = useTranslations('actions')

  useEffect(() => {
    setApiErrorsTranslator((key: string) => {
      try {
        return t(normalizeErrorKey(key) as any)
      } catch {
        return key
      }
    })
  }, [t])

  const translateErrorKey = (key: string) => {
    try {
      return t(normalizeErrorKey(key) as any)
    } catch {
      return key
    }
  }

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const meta = query.meta as Record<string, unknown> | undefined
            if (meta?.showErrorToast) {
              const msg = error instanceof ApiError ? translateErrorKey(error.message) : undefined
              if (msg) {
                notifyError(msg)
              } else {
                notifyError(error)
              }
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            const meta = mutation.meta as Record<string, unknown> | undefined
            if (meta?.skipGlobalError) return
            const msg = error instanceof ApiError ? translateErrorKey(error.message) : undefined
            if (msg) {
              notifyError(msg)
            } else {
              notifyError(error)
            }
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            const meta = mutation.meta as Record<string, unknown> | undefined
            if (meta?.showSuccessToast) {
              const msg =
                typeof meta.showSuccessToast === 'string'
                  ? meta.showSuccessToast
                  : tActions('common.success')
              notifySuccess(msg)
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [t, tActions, translateErrorKey],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthInit />
        <TooltipProvider>{children}</TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
