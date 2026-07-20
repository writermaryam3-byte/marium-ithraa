'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Handshake } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useDeals } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const ORG_URL = `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`

export default function OrganizationDealsPage() {
  const locale = useLocale()
  const t = useTranslations('deals')
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useDeals()
  const deals = useMemo(() => {
    if (!Array.isArray(data)) return []
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (d) => d.activity?.name?.toLowerCase().includes(q) || d.status?.toLowerCase().includes(q),
    )
  }, [data, search])

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[{ href: ORG_URL, label: t('dashboard') }, { label: t('deals') }]}
        title={t('deals')}
        subtitle={t('dealsSubtitle')}
        action={{
          label: t('createDeal'),
          href: `${ORG_URL}/${Pages.DEALS}/new`,
        }}
      />

      <Input
        placeholder={t('search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isError ? (
        <p className="text-sm text-destructive">{t('loadError')}</p>
      ) : deals.length === 0 ? (
        <EmptyState title={t('noDeals')} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {deals.map((deal) => (
            <Card key={deal.id} className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Handshake className="text-fuchsia-600 size-4" />
                  {deal.activity?.name ?? t('deal')}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('studentsCount')}: {deal.studentsCount}
                </p>
                <Badge
                  variant={
                    deal.status === 'OPEN'
                      ? 'default'
                      : deal.status === 'AWARDED'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {deal.status}
                </Badge>
                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href={`${ORG_URL}/${Pages.DEALS}/${deal.id}`}>{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
