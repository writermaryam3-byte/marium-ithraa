'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Handshake, Search } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDeals } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

const STATUS_KEYS = {
  OPEN: 'open',
  AWARDED: 'awarded',
  CLOSED: 'closed',
} as const

function getStatusLabel(status: string, t: ReturnType<typeof useTranslations<'deals'>>) {
  const key = STATUS_KEYS[status as keyof typeof STATUS_KEYS]
  return key ? t(key) : status
}

export default function AdminDealsPage() {
  const locale = useLocale()
  const t = useTranslations('deals')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { data, isLoading } = useDeals()

  const deals = useMemo(() => {
    if (!Array.isArray(data)) return []
    let filtered = data
    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      filtered = filtered.filter(
        (d) =>
          d.activity?.name?.toLowerCase().includes(q) ||
          d.organization?.organizationName?.toLowerCase().includes(q),
      )
    }
    return filtered
  }, [data, statusFilter, search])

  const pageShell = (content: React.ReactNode) => (
    <>
      <SiteHeader titleKey="navigation.dashboard.deals" />
      <div className="flex flex-1 flex-col" dir={getTextDirection(locale)}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">{content}</div>
        </div>
      </div>
    </>
  )

  if (isLoading) {
    return pageShell(
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>,
    )
  }

  return pageShell(
    <>
      <Card className="rounded-2xl border-amber-50/70 bg-white/80 shadow-sm">
        <CardHeader className="space-y-1 text-start">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Handshake className="size-5 text-fuchsia-600" />
            {t('adminDealsTitle')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute inset-y-0 inset-s-3 my-auto size-4 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-xl sm:w-[200px]">
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="OPEN">{t('open')}</SelectItem>
                <SelectItem value="AWARDED">{t('awarded')}</SelectItem>
                <SelectItem value="CLOSED">{t('closed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {deals.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">{t('noDeals')}</p>
            </div>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {deals.map((deal) => (
                <Card key={deal.id} className="rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">
                        {deal.activity?.name ?? t('deal')}
                      </CardTitle>
                      <Badge variant="outline">{getStatusLabel(deal.status, t)}</Badge>
                    </div>
                    <CardDescription>{deal.organization?.organizationName ?? '—'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      {t('studentsCount')}:{' '}
                      <span className="font-medium text-foreground">{deal.studentsCount}</span>
                    </p>
                    <Button variant="outline" size="sm" className="rounded-xl" asChild>
                      <Link href={`${ADMIN_URL}/${Pages.DEALS}/${deal.id}`}>{t('viewDetails')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}
        </CardContent>
      </Card>
    </>,
  )
}
