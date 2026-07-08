'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Handshake } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6" dir={getTextDirection(locale)}>
      <h2 className="text-xl font-semibold">{t('adminDealsTitle')}</h2>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
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
        <p className="text-sm text-muted-foreground py-8 text-center">{t('noDeals')}</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Card key={deal.id} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Handshake className="size-4" />
                  {deal.activity?.name ?? t('deal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {deal.organization?.organizationName ?? '—'}
                </p>
                <p>
                  {t('studentsCount')}: {deal.studentsCount}
                </p>
                <Badge>{deal.status}</Badge>
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`${ADMIN_URL}/${Pages.DEALS}/${deal.id}`}>{t('viewDetails')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
