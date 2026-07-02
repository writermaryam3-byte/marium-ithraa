'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'

import { CalendarDays, Download, FileText } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { METRIC_VARIANTS, type MetricVariant } from '@/components/shared/dashboard/metric-variants'

export type ClassMetric = {
  id: string
  title: string
  value: string
  variant?: MetricVariant
}

export type ChildResultItem = {
  id: string
  name: string
  className: string
  value: string
  imageSrc?: string
}

export type EvaluationStatusItem = {
  id: string
  name: string
  className: string
  status: string
  statusClassName?: string
  reminderDisabled?: boolean
  imageSrc?: string
}

export type ReportItem = {
  id: string
  title: string
  childrenCountLabel: string
  dateLabel: string
}

export type ResultsData = {
  classOptions: Array<{ id: string; label: string }>
  classMetrics: ClassMetric[]
  topIntelligences: ClassMetric[]
  childResults: ChildResultItem[]
  evaluationStatuses: EvaluationStatusItem[]
  reports: ReportItem[]
}

const metricVariantClass: Record<MetricVariant, string> = METRIC_VARIANTS

function MetricCard({ title, value, variant = 'purple' }: ClassMetric) {
  return (
    <Card className={cn('rounded-2xl border-0 shadow-sm', metricVariantClass[variant])}>
      <CardContent className="p-6 text-center">
        <p className="text-2xl font-bold">{title}</p>
        <p className="mt-2 text-sm font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

function ChildResultCard({ child, locale }: { child: ChildResultItem; locale: string }) {
  const t = useTranslations('OrgResults')
  return (
    <Card className="rounded-2xl border bg-card shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-14 rounded-xl">
            <AvatarImage
              src={child.imageSrc ?? '/avatar-placeholder.svg'}
              alt={child.name}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl text-xs">CH</AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-end text-xs">
            <p className="truncate text-primary">{t('childResult.name', { name: child.name })}</p>
            <p className="truncate text-primary/80">
              {t('childResult.class', { className: child.className })}
            </p>
            <p className="truncate text-primary/80">
              {t('childResult.result', { value: child.value })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EvaluationStatusCard({ item, locale }: { item: EvaluationStatusItem; locale: string }) {
  const t = useTranslations('OrgResults')
  return (
    <Card className="rounded-2xl border bg-card shadow-sm">
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-16 rounded-xl">
            <AvatarImage
              src={item.imageSrc ?? '/avatar-placeholder.svg'}
              alt={item.name}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl text-xs">CH</AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-end text-sm">
            <p className="truncate text-primary">
              {t('evaluationStatus.name', { name: item.name })}
            </p>
            <p className="truncate text-primary/80">
              {t('evaluationStatus.class', { className: item.className })}
            </p>
            <p className={cn('truncate font-semibold', item.statusClassName ?? 'text-emerald-600')}>
              {t('evaluationStatus.status', { status: item.status })}
            </p>
          </div>
        </div>
        <Button
          variant="gradient"
          className="h-9 w-full rounded-lg"
          disabled={item.reminderDisabled}
        >
          {t('sendReminder')}
        </Button>
      </CardContent>
    </Card>
  )
}

function ReportCard({ item, locale }: { item: ReportItem; locale: string }) {
  const t = useTranslations('OrgResults')
  return (
    <Card className="rounded-2xl border bg-card shadow-sm">
      <CardContent className="space-y-3 p-4 text-end">
        <p className="font-bold text-primary">{item.title}</p>
        <p className="flex items-center justify-end gap-1 text-sm text-primary/80">
          <span>{item.childrenCountLabel}</span>
          <FileText className="size-4 text-muted-foreground" />
        </p>
        <p className="flex items-center justify-end gap-1 text-sm text-primary/80">
          <span>{item.dateLabel}</span>
          <CalendarDays className="size-4 text-muted-foreground" />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-lg border-fuchsia-500/60 text-fuchsia-600">
            {t('downloadExcel')}
          </Button>
          <Button variant="gradient" className="rounded-lg">
            <Download className="size-4" />
            {t('downloadPdf')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ResultsScreen({
  locale,
  data,
  defaultTab = 'evaluation',
}: {
  locale: string
  data: ResultsData
  defaultTab?: 'evaluation' | 'results' | 'reports'
}) {
  const isAr = locale === 'ar'
  const t = useTranslations('OrgResults')

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: t('breadcrumb.home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-3 bg-transparent p-0">
          <TabsTrigger
            value="evaluation"
            className="h-11 rounded-xl bg-muted text-base data-[state=active]:bg-surface-accent"
          >
            {t('tabs.evaluation')}
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="h-11 rounded-xl bg-muted text-base data-[state=active]:bg-surface-accent"
          >
            {t('tabs.results')}
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="h-11 rounded-xl bg-muted text-base data-[state=active]:bg-surface-accent"
          >
            {t('tabs.reports')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evaluation" className="pt-4">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.evaluationStatuses.map((item) => (
              <EvaluationStatusCard key={item.id} item={item} locale={locale} />
            ))}
          </section>
        </TabsContent>

        <TabsContent value="results" className="space-y-6 pt-4">
          <div className="flex items-center justify-end">
            <div className="w-full max-w-xs">
              <Select defaultValue={data.classOptions[0]?.id}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {data.classOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground text-end">{t('classStats')}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {data.classMetrics.map((m) => (
                <MetricCard key={m.id} {...m} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground text-end">{t('topIntelligences')}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {data.topIntelligences.map((m) => (
                <MetricCard key={m.id} {...m} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground text-end">{t('childrenResults')}</h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.childResults.map((child) => (
                <ChildResultCard key={child.id} child={child} locale={locale} />
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.reports.map((report) => (
              <ReportCard key={report.id} item={report} locale={locale} />
            ))}
          </section>
        </TabsContent>
      </Tabs>
    </main>
  )
}
