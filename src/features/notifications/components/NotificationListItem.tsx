'use client'

import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { NotificationItem } from '@/features/notifications/types'
import { cn } from '@/lib/utils'

import { formatNotificationDate, getNotificationTypeIcon } from './notification-utils'
import { resolveNotificationText } from '../utils/resolveNotificationText'

function getTypeBadgeLabel(type: string | undefined, t: ReturnType<typeof useTranslations>) {
  if (!type) return t('typeGeneral')
  if (type.startsWith('evaluation') && type !== 'evaluation_reminder') {
    return t('typeEvaluations')
  }
  if (type === 'evaluation_reminder') return t('typeReminders')
  if (type.startsWith('payment')) return t('typePayment')
  return t('typeGeneral')
}

type Props = {
  item: NotificationItem
  locale: string
  compact?: boolean
  onOpen: () => void
  onMarkRead?: () => void
  isMarking?: boolean
}

export function NotificationListItem({
  item,
  locale,
  compact = false,
  onOpen,
  onMarkRead,
  isMarking = false,
}: Props) {
  const t = useTranslations('notifications')
  const isAr = locale === 'ar'
  const Icon = getNotificationTypeIcon(item.type)
  const title = resolveNotificationText(item.title, t, item.metadata)
  const message = resolveNotificationText(item.message, t, item.metadata)

  return (
    <Card
      className={cn(
        'rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md',
        !item.isRead && 'border-fuchsia-300/50 ring-1 ring-fuchsia-200/60',
      )}
    >
      <CardContent
        className={cn('flex items-center justify-between gap-4', compact ? 'p-3' : 'p-5')}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-start"
        >
          <div
            className={cn(
              'grid shrink-0 place-items-center rounded-xl bg-surface text-fuchsia-600',
              compact ? 'size-9 [&_svg]:size-4' : 'size-11 [&_svg]:size-5',
            )}
          >
            <Icon />
          </div>
          <div className="min-w-0 space-y-1">
            <p
              className={cn(
                'truncate font-semibold text-foreground',
                compact ? 'text-sm' : 'text-base',
              )}
            >
              {title}
            </p>
            <p
              className={cn('text-muted-foreground line-clamp-2', compact ? 'text-xs' : 'text-sm')}
            >
              {message}
            </p>
            {!compact && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="outline" className="rounded-lg text-[10px]">
                  {getTypeBadgeLabel(item.type, t)}
                </Badge>
                <Badge
                  variant={item.isRead ? 'secondary' : 'default'}
                  className="rounded-lg text-[10px]"
                >
                  {item.isRead ? t('read') : t('unread')}
                </Badge>
              </div>
            )}
          </div>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              'font-semibold text-primary whitespace-nowrap',
              compact ? 'text-[10px]' : 'text-sm',
            )}
          >
            {formatNotificationDate(item.createdAt, locale)}
          </span>
          {!compact && !item.isRead && onMarkRead && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl border-fuchsia-500/50 text-fuchsia-600 hover:bg-fuchsia-50"
              disabled={isMarking}
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead()
              }}
            >
              {t('markRead')}
            </Button>
          )}
          {!compact && item.isRead && (
            <Button
              variant="gradient"
              type="button"
              size="sm"
              className="h-8 rounded-xl px-3"
              onClick={onOpen}
            >
              {t('open')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
