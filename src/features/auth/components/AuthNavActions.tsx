'use client'

import { LogIn, LogOut, UserCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import { useAuth } from '../hooks/useAuth'
import { Routes, Pages } from '@/lib/types/enums'
import NotificationBell from '@/features/notifications/components/NotificationsBell'

type Props = {
  locale: string
  showNotifications?: boolean
  showLanguage?: boolean
  signupHref?: string
}

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function AuthNavActions({
  locale,
  showNotifications = false,
  showLanguage = true,
  signupHref,
}: Props) {
  const t = useTranslations('navigation.header')
  const tAuth = useTranslations('auth')
  const { user, isAuthenticated, isLoading, logout, loginPath, signupPath } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        {showNotifications ? <Skeleton className="size-9 rounded-full" /> : null}
        {showLanguage ? <Skeleton className="h-9 w-9 rounded-full" /> : null}
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        {showNotifications ? <NotificationBell /> : null}
        {/* {showLanguage ? <LanguageSwitcher locale={locale} /> : null} */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-2 rounded-full px-2 py-1.5 hover:bg-fuchsia-50"
            >
              <Avatar className="size-8">
                <AvatarFallback className="rounded-full bg-fuchsia-100 text-fuchsia-700 text-xs font-semibold">
                  {userInitials(user.name || user.phone)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate text-sm font-semibold lg:inline">
                {user.name || user.phone}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <p className="truncate font-semibold">{user.name || user.phone}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email || user.phone}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${Routes.AUTH}/${Pages.LOGIN}`} className="cursor-pointer">
                <UserCircle className="size-4" />
                {tAuth('dashboard')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => void logout()}
            >
              <LogOut className="size-4" />
              {tAuth('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* {showLanguage ? <LanguageSwitcher locale={locale} /> : null} */}
      {signupHref ? (
        <Button asChild variant="outline" className="hidden rounded-full sm:inline-flex">
          <Link href={signupHref}>{tAuth('signup')}</Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="hidden rounded-full sm:inline-flex">
          <Link href={signupPath}>{tAuth('signup')}</Link>
        </Button>
      )}
      <Button
        asChild
        className="rounded-full px-5 bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
      >
        <Link href={loginPath} className="inline-flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          {t('login')}
        </Link>
      </Button>
    </div>
  )
}
