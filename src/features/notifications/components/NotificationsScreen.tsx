'use client'

import { Bell, Inbox } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { NotificationListItem } from '@/features/notifications/components/NotificationListItem'
import {
  filterNotificationsByCategory,
  getApiTypeFilter,
  getNotificationHref,
} from '@/features/notifications/components/notification-utils'
import { StatsGrid } from '@/components/shared/dashboard/StatsGrid'
import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useMarkAllRead,
  useMarkOneRead,
  useNotificationsList,
  useUnreadCount,
} from '@/features/notifications/hooks'
import type { NotificationItem } from '@/features/notifications/types'
import { useRouter } from '@/i18n/navigation'

type Props = { locale: string }

const LIMIT = 10

const tabTriggerClass =
  'h-11 rounded-xl bg-white/80 text-base data-[state=active]:bg-surface-accent data-[state=active]:shadow'

export function NotificationsScreen({ locale }: Props) {
  const t = useTranslations('notifications')
  const router = useRouter()
  const isAr = locale === 'ar'

  const [page, setPage] = useState(1)
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const listParams = useMemo(
    () => ({
      page,
      limit: LIMIT,
      unreadOnly: readFilter === 'unread',
      type: getApiTypeFilter(typeFilter),
    }),
    [page, readFilter, typeFilter],
  )

  const unreadQuery = useUnreadCount()
  const listQuery = useNotificationsList(listParams)
  const markOne = useMarkOneRead()
  const markAll = useMarkAllRead()

  const items = useMemo(() => {
    const rawItems = listQuery.data?.items ?? []
    return typeFilter === 'evaluations'
      ? filterNotificationsByCategory(rawItems, 'evaluations')
      : rawItems
  }, [listQuery.data?.items, typeFilter])

  const meta = listQuery.data?.meta
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const unreadCount = unreadQuery.data?.count ?? 0
  const totalCount = meta?.total ?? items.length

  const handleOpen = async (item: NotificationItem) => {
    const href = getNotificationHref(item.metadata)

    if (!item.isRead) {
      try {
        await markOne.mutateAsync(item.id)
      } catch {
        // non-blocking
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
    <main className="min-h-screen bg-surface py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="app-container space-y-8">
        <ManagementPageHeader
          breadcrumbs={[
            {
              href: '/dashboards',
              label: isAr ? 'الرئيسية' : 'Home',
            },
            { label: t('title') },
          ]}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <StatsGrid
          items={[
            {
              label: t('unread'),
              value: unreadCount,
              icon: <Bell />,
              variant: 'purple',
            },
            {
              label: t('filterAll'),
              value: totalCount,
              icon: <Inbox />,
              variant: 'indigo',
            },
          ]}
        />

        <Card className="rounded-2xl border bg-white/90 shadow-sm">
          <CardContent className="space-y-4 p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Tabs
                value={readFilter}
                onValueChange={(v) => {
                  setReadFilter(v as 'all' | 'unread')
                  setPage(1)
                }}
              >
                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:w-auto">
                  <TabsTrigger value="all" className={tabTriggerClass}>
                    {t('filterAll')}
                  </TabsTrigger>
                  <TabsTrigger value="unread" className={tabTriggerClass}>
                    {t('filterUnread')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={typeFilter}
                  onValueChange={(v) => {
                    setTypeFilter(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full min-w-[160px] rounded-xl bg-white sm:w-[180px]">
                    <SelectValue placeholder={t('typeFilterAll')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('typeFilterAll')}</SelectItem>
                    <SelectItem value="evaluations">{t('typeEvaluations')}</SelectItem>
                    <SelectItem value="reminders">{t('typeReminders')}</SelectItem>
                    <SelectItem value="payment">{t('typePayment')}</SelectItem>
                    <SelectItem value="general">{t('typeGeneral')}</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="gradient"
                  className="rounded-xl"
                  disabled={markAll.isPending || unreadCount === 0}
                  onClick={() => void handleMarkAll()}
                >
                  {t('markAllRead')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {listQuery.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : listQuery.isError ? (
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardContent className="space-y-3 py-12 text-center">
              <p className="text-sm text-destructive">{t('loadError')}</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => void listQuery.refetch()}
              >
                {t('retry')}
              </Button>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <EmptyState title={t('empty')} />
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <NotificationListItem
                key={item.id}
                item={item}
                locale={locale}
                isMarking={markOne.isPending}
                onMarkRead={async () => {
                  try {
                    await markOne.mutateAsync(item.id)
                  } catch (e: unknown) {
                    showErrorToast({ error: e })
                  }
                }}
                onOpen={() => void handleOpen(item)}
              />
            ))}
          </section>
        )}

        {meta && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/90 px-4 py-3 text-sm text-muted-foreground shadow-sm">
            <span>{t('pageOf', { page: currentPage, total: totalPages })}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t('prev')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('next')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
