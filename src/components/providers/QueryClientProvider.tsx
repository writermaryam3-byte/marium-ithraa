'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

import { AuthInit } from '@/features/auth/components/AuthInit'
import { notifyError, notifySuccess } from '@/lib/toast/app-toast'
import { TooltipProvider } from '../ui/tooltip'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const meta = query.meta as Record<string, unknown> | undefined
      if (meta?.showErrorToast) {
        notifyError(error)
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const meta = mutation.meta as Record<string, unknown> | undefined
      if (meta?.skipGlobalError) return
      notifyError(error)
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      const meta = mutation.meta as Record<string, unknown> | undefined
      if (meta?.showSuccessToast) {
        const msg =
          typeof meta.showSuccessToast === 'string'
            ? meta.showSuccessToast
            : 'Operation completed successfully'
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
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthInit />
        <TooltipProvider>{children}</TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
