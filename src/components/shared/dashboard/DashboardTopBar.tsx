'use client'

import { useLocale } from 'next-intl'

import LanguageSwitcher from '@/components/layouts/header/langSwitch'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'

type Props = {
  withSidebar?: boolean
  className?: string
}

export function DashboardTopBar({ withSidebar = true, className }: Props) {
  const locale = useLocale()

  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2',
        'border-b border-amber-50/70 bg-white/80 shadow-sm backdrop-blur-md',
        className,
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {withSidebar ? (
          <>
            <SidebarTrigger className="-ms-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          </>
        ) : null}
        <div className="ms-auto flex items-center gap-2">
          <NotificationBell />
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}
