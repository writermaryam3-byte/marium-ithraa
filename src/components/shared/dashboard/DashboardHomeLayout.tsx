import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Props = {
  locale: string
  children: ReactNode
  className?: string
}

/** Organization-style home page wrapper (WelcomeHero + stats + activity). */
export function DashboardHomeLayout({ locale, children, className }: Props) {
  const isAr = locale === 'ar'

  return (
    <main className={cn('app-container space-y-10 py-8', className)} dir={isAr ? 'rtl' : 'ltr'}>
      {children}
    </main>
  )
}
