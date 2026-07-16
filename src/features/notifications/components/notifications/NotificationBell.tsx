'use client'

import { Bell } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useMarkAllRead,
  useMarkOneRead,
  useNotificationsList,
  useUnreadCount,
} from '@/features/notifications/hooks'
import type { NotificationItem } from '@/features/notifications/types'
import { Link, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { NotificationListItem } from '../NotificationListItem'
import { getNotificationHref } from '../notification-utils'

export function NotificationBell() {
  const t = useTranslations('notifications')
  const locale = useLocale()
  const router = useRouter()
  // const isAr = locale === "ar"

  const unreadQuery = useUnreadCount(30_000)
  const listQuery = useNotificationsList({ page: 1, limit: 5 })
  const markOne = useMarkOneRead()
  const markAll = useMarkAllRead()

  const count = unreadQuery.data?.count ?? 0
  const items = listQuery.data?.items ?? []

  console.log(items)

  const handleOpen = async (item: NotificationItem) => {
    const href = getNotificationHref(item.metadata)

    if (!item.isRead) {
      try {
        await markOne.mutateAsync(item.id)
      } catch {
        // allow navigation even if mark fails
      }
    }

    if (href) {
      router.push(href)
    }
  }

  const handleMarkAll = async () => {
    try {
      await markAll.mutateAsync()
      showSuccessToast(t, 'markAllRead')
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative rounded-full', 'hover:bg-fuchsia-50 hover:text-fuchsia-600')}
          aria-label={t('title')}
        >
          <Bell className="size-5" />
          {count > 0 && (
            <Badge
              className="absolute -top-1 -inset-e-1 h-5 min-w-5 justify-center rounded-full border-0 bg-linear-to-r from-fuchsia-600 to-violet-600 px-1 text-[11px] text-white"
              aria-label={`${count}`}
            >
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-[min(100vw-2rem,24rem)] overflow-hidden rounded-3xl border border-amber-50/70 p-0 shadow-lg',
          'bg-white/95 backdrop-blur-md',
        )}
        // dir={isAr ? "rtl" : "ltr"}
      >
        <DropdownMenuLabel className="flex items-center justify-between gap-2 bg-surface/60 px-4 py-3">
          <span className="font-bold text-foreground">{t('title')}</span>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-lg text-xs text-fuchsia-600 hover:bg-fuchsia-50"
              disabled={markAll.isPending}
              onClick={(e) => {
                e.preventDefault()
                void handleMarkAll()
              }}
            >
              {t('markAllRead')}
            </Button>
          )}
        </DropdownMenuLabel>

        <Separator />

        <div className="max-h-[min(24rem,60vh)] overflow-y-auto bg-surface/30 p-2">
          {listQuery.isLoading ? (
            <div className="space-y-2 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{t('empty')}</p>
          ) : (
            <div className="space-y-2">
              {/* {items.map((item) => (
                <NotificationListItem
                  key={item.id}
                  item={item}
                  locale={locale}
                  compact
                  onOpen={() => void handleOpen(item)}
                />
              ))} */}
            </div>
          )}
        </div>

        <Separator />

        <div className="p-2">
          <Button variant="gradient" asChild className="w-full rounded-xl">
            <Link href="/dashboards/notifications">{t('viewAll')}</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
