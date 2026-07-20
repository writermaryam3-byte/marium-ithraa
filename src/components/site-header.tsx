'use client'

import { useLocale, useTranslations } from 'next-intl'

import LanguageSwitcher from '@/components/layouts/header/langSwitch'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'

export function SiteHeader({
  title,
  titleKey,
  withSidebar = true,
}: {
  title?: string
  titleKey?: string
  withSidebar?: boolean
}) {
  const locale = useLocale()
  const t = useTranslations()

  const resolvedTitle = titleKey ? t(titleKey) : title

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-amber-50/70 bg-white/80 shadow-sm backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {withSidebar ? (
          <>
            <SidebarTrigger className="-ms-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          </>
        ) : null}
        <h1 className="text-base font-medium">{resolvedTitle}</h1>
        <div className="ms-auto flex items-center gap-2">
          <NotificationBell />
          <LanguageSwitcher locale={locale} />
        </div>
        {/* <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div> */}
      </div>
    </header>
  )
}
