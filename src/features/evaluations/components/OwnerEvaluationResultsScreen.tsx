'use client'

import { useState } from 'react'
import { CalendarDays, Download, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { showErrorToast, showInfoToast, showSuccessToast } from '@/lib/toast/app-toast'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  OwnerClassEvaluationSummary,
  OwnerEvaluationReportsResponse,
} from '@/features/evaluations/api'
import {
  useOwnerClassEvaluationStatus,
  useOwnerClassEvaluationSummary,
  useOwnerEvaluationFilters,
  useOwnerEvaluationReports,
  useSendOwnerEvaluationReminder,
} from '@/features/evaluations/hooks'
import type { EvaluationType } from '@/features/evaluations/types'
import { getEvaluationTypeLabel } from '@/features/evaluations/utils/labels'
import { Link } from '@/i18n/navigation'
import { getDateLocale, getTextDirection } from '@/lib/i18n/locale-utils'
import { cn } from '@/lib/utils'
import { getChildId } from '@/lib/types/interfaces'

type Props = { locale: string }

type CardVariant = 'brand-purple' | 'brand-navy' | 'stat-pink' | 'stat-indigo'

function formatScore(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return String(value)
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return `${value}%`
}

function MetricCard({
  title,
  value,
  variant = 'brand-purple',
}: {
  title: string
  value: string
  variant?: CardVariant
}) {
  const variantStyles = {
    'brand-purple':
      'bg-brand-purple/5 dark:bg-brand-purple/10 border border-brand-purple/20 text-brand-purple dark:text-purple-300',
    'brand-navy':
      'bg-brand-navy/5 dark:bg-brand-navy/10 border border-brand-navy/20 text-brand-navy dark:text-blue-300',
    'stat-pink':
      'bg-stat-pink/5 dark:bg-stat-pink/10 border border-stat-pink/20 text-stat-pink dark:text-pink-300',
    'stat-indigo':
      'bg-stat-indigo/5 dark:bg-stat-indigo/10 border border-stat-indigo/20 text-stat-indigo dark:text-indigo-300',
  }

  return (
    <Card
      className={cn(
        'rounded-2xl border-0 shadow-sm transition-all duration-300',
        variantStyles[variant],
      )}
    >
      <CardContent className="p-5 text-center space-y-2">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
          {title}
        </p>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}

function QueryError({
  message,
  onRetry,
  retryLabel,
}: {
  message: string
  onRetry: () => void
  retryLabel: string
}) {
  return (
    <div className="p-4">
      <ErrorCard message={message} retry={{ label: retryLabel, onClick: onRetry }} />
    </div>
  )
}

function FiltersBar({
  classId,
  evaluationId,
  onClassChange,
  onEvaluationChange,
  classes,
  evaluations,
  disabled,
}: {
  classId: string
  evaluationId: string
  onClassChange: (v: string) => void
  onEvaluationChange: (v: string) => void
  classes: { id: string; name: string }[]
  evaluations: {
    id: string
    title: string
    type: string
  }[]
  disabled?: boolean
}) {
  const t = useTranslations('evaluations.organization')
  const tEval = useTranslations('evaluations')

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5 text-end">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('class')}</label>
        <Select
          value={classId || undefined}
          onValueChange={onClassChange}
          disabled={disabled || classes.length === 0}
        >
          <SelectTrigger className="w-full bg-background rounded-xl border-slate-200 dark:border-slate-800">
            <SelectValue placeholder={t('selectClass')} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 text-end">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {t('evaluation')}
        </label>
        <Select
          value={evaluationId || undefined}
          onValueChange={onEvaluationChange}
          disabled={disabled || evaluations.length === 0}
        >
          <SelectTrigger className="w-full bg-background rounded-xl border-slate-200 dark:border-slate-800">
            <SelectValue placeholder={t('selectEvaluation')} />
          </SelectTrigger>
          <SelectContent>
            {evaluations.map((ev) => (
              <SelectItem key={ev.id} value={ev.id}>
                {ev.title}
                {` (${getEvaluationTypeLabel(ev.type as EvaluationType, tEval)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function ReportsTab({ locale, evaluationId }: { locale: string; evaluationId: string }) {
  const t = useTranslations('evaluations.organization')
  const reportsQuery = useOwnerEvaluationReports(evaluationId || undefined)

  const showPdfExportSoon = () => {
    showInfoToast(t, 'pdfExportSoon')
  }

  const showExcelExportSoon = () => {
    showInfoToast(t, 'excelExportSoon')
  }

  if (reportsQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (reportsQuery.isError) {
    return (
      <QueryError
        message={t('error')}
        onRetry={() => void reportsQuery.refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  const reports = reportsQuery.data?.reports ?? []

  if (reports.length === 0) {
    return <EmptyState title={t('empty')} />
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <ReportCard
          key={`${report.classId}-${report.evaluationId ?? 'none'}-${report.title}`}
          report={report}
          onPdfExport={showPdfExportSoon}
          onExcelExport={showExcelExportSoon}
          locale={locale}
        />
      ))}
    </section>
  )
}

function ReportCard({
  report,
  onPdfExport,
  onExcelExport,
  locale,
}: {
  report: OwnerEvaluationReportsResponse['reports'][number]
  onPdfExport: () => void
  onExcelExport: () => void
  locale: string
}) {
  const t = useTranslations('evaluations.organization')
  const dateLabel = report.reportDate
    ? new Date(report.reportDate).toLocaleDateString(getDateLocale(locale))
    : '—'

  return (
    <Card className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <CardContent className="space-y-4 p-5 text-end" dir={getTextDirection(locale)}>
        <p className="font-extrabold text-lg text-slate-900 dark:text-slate-50">{report.title}</p>
        <div className="space-y-1 text-sm text-muted-foreground font-medium">
          <p>
            {t('class')}: <span className="text-foreground">{report.className}</span>
          </p>
          <p>
            {t('evaluation')}: <span className="text-foreground">{report.evaluationTitle}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <p className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span>
              {report.evaluatedCount} / {report.childrenCount} {t('childrenUnit')}
            </span>
            <FileText className="size-4 text-brand-purple" />
          </p>
          <p className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground">
            <span>{dateLabel}</span>
            <CalendarDays className="size-4 text-muted-foreground" />
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="rounded-xl border-stat-pink/40 text-stat-pink hover:bg-stat-pink/5"
            onClick={onExcelExport}
          >
            {t('downloadExcel')}
          </Button>
          <Button variant="gradient" className="rounded-xl gap-2 shadow-sm" onClick={onPdfExport}>
            <Download className="size-4" />
            {t('downloadPdf')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultsTab({ classId, evaluationId }: { classId: string; evaluationId: string }) {
  const t = useTranslations('evaluations.organization')
  const summaryQuery = useOwnerClassEvaluationSummary(classId, evaluationId)

  if (!classId || !evaluationId) {
    return (
      <p className="text-center text-sm text-muted-foreground py-12">
        {t('selectClassAndEvaluation')}
      </p>
    )
  }

  if (summaryQuery.isLoading) {
    return <ResultsTabSkeleton />
  }

  if (summaryQuery.isError) {
    return (
      <QueryError
        message={t('error')}
        onRetry={() => void summaryQuery.refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  if (!summaryQuery.data) {
    return <EmptyState title={t('empty')} />
  }

  return <ResultsTabContent summary={summaryQuery.data} />
}

function ResultsTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function ResultsTabContent({ summary }: { summary: OwnerClassEvaluationSummary }) {
  const t = useTranslations('evaluations.organization')
  const isLearningStyles = summary.evaluationType === 'learning_styles'
  const topDims = summary.topDimensions ?? []

  const statCards: { title: string; value: string; variant: CardVariant }[] = [
    {
      title: t('highestScore'),
      value: formatScore(summary.highestScore),
      variant: 'brand-purple',
    },
    {
      title: t('averageScore'),
      value: formatScore(summary.averageScore),
      variant: 'brand-navy',
    },
    {
      title: t('lowestScore'),
      value: formatScore(summary.lowestScore),
      variant: 'stat-pink',
    },
    {
      title: t('childrenCount'),
      value: String(summary.totalChildren),
      variant: 'stat-indigo',
    },
    {
      title: t('approved'),
      value: String(summary.approvedCount),
      variant: 'brand-navy',
    },
    {
      title: t('waitingApproval'),
      value: String(summary.submittedCount),
      variant: 'stat-pink',
    },
    {
      title: t('inProgress'),
      value: String(summary.inProgressCount),
      variant: 'brand-purple',
    },
    {
      title: t('notStarted'),
      value: String(summary.notStartedCount),
      variant: 'stat-indigo',
    },
  ]

  return (
    <div className="space-y-10">
      {/* قسم إحصائيات الفصل */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 justify-start">
          <span className="size-2.5 rounded-full bg-brand-purple" />
          {t('classStats')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* قسم الأبعاد الأكثر تميزاً */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 justify-start">
          <span className="size-2.5 rounded-full bg-brand-navy" />
          {t('topDimensions')}
        </h3>
        {topDims.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8 bg-muted/30 rounded-2xl border border-dashed">
            {t('noTopDimensions')}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {topDims.slice(0, 3).map((dim, idx) => (
              <MetricCard
                key={dim.code ?? idx}
                title={dim.name ?? dim.code ?? '—'}
                value={
                  dim.percentage != null ? formatPercent(dim.percentage) : formatScore(dim.score)
                }
                variant={idx === 0 ? 'brand-purple' : idx === 1 ? 'brand-navy' : 'stat-pink'}
              />
            ))}
          </div>
        )}
      </section>

      {/* قسم نتائج الأطفال */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 justify-start">
          <span className="size-2.5 rounded-full bg-stat-pink" />
          {t('childrenResults')}
        </h3>
        {summary.children.length === 0 ? (
          <EmptyState title={t('empty')} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {summary.children.map((child) => (
              <ChildResultCard
                key={getChildId(child) ?? child.childName}
                isLearningStyles={isLearningStyles}
                child={child}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ChildResultCard({
  child,
  isLearningStyles,
}: {
  child: OwnerClassEvaluationSummary['children'][number]
  isLearningStyles: boolean
}) {
  const t = useTranslations('evaluations.organization')

  const resultLine = isLearningStyles
    ? [child.topResultLabel, child.topDimensionName].filter(Boolean).join(' · ') || '—'
    : formatScore(child.score)

  const content = (
    <Card className="rounded-2xl border bg-card hover:border-brand-purple/30 shadow-sm h-full transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="size-14 rounded-xl shrink-0 border border-slate-100 dark:border-slate-800">
            <AvatarImage
              src="/avatar-placeholder.svg"
              alt={child.childName}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl text-xs font-bold bg-brand-purple/10 text-brand-purple">
              CH
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-end text-xs space-y-1.5">
            <p className="font-bold text-sm text-slate-900 dark:text-slate-50 truncate">
              {child.childName}
            </p>
            <p className="text-muted-foreground font-medium truncate">{child.className}</p>
            <Badge
              variant="secondary"
              className="text-[10px] rounded-lg px-2 py-0.5 font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {child.statusLabel}
            </Badge>
            <p className="text-slate-800 dark:text-slate-200 font-semibold pt-1">
              {isLearningStyles ? t('result') : t('score')}:{' '}
              <span className="text-brand-purple">{resultLine}</span>
            </p>
            {!isLearningStyles && child.topDimensionName && (
              <p className="text-muted-foreground font-medium truncate">
                {child.topDimensionName}
                {child.topDimensionPercentage != null
                  ? ` (${formatPercent(child.topDimensionPercentage)})`
                  : ''}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (child.attemptId) {
    return (
      <Link
        href={`/dashboards/organization/attempts/${child.attemptId}`}
        className="block transition-transform duration-200 hover:scale-[1.01]"
      >
        {content}
      </Link>
    )
  }

  return content
}

function StatusTab({
  locale,
  classId,
  evaluationId,
}: {
  locale: string
  classId: string
  evaluationId: string
}) {
  const t = useTranslations('evaluations.organization')
  const statusQuery = useOwnerClassEvaluationStatus(classId, evaluationId)
  const reminderMutation = useSendOwnerEvaluationReminder(classId, evaluationId)

  if (!classId || !evaluationId) {
    return (
      <p className="text-center text-sm text-muted-foreground py-12">
        {t('selectClassAndEvaluation')}
      </p>
    )
  }

  if (statusQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (statusQuery.isError) {
    return (
      <QueryError
        message={t('error')}
        onRetry={() => void statusQuery.refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  const children = statusQuery.data?.children ?? []

  if (children.length === 0) {
    return <EmptyState title={t('empty')} />
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {children.map((item) => (
        <StatusChildCard
          key={getChildId(item) ?? item.childName}
          item={item}
          isPending={reminderMutation.isPending}
          onReminder={async () => {
            try {
              await reminderMutation.mutateAsync(getChildId(item)!)
              showSuccessToast({
                raw: t('reminderSuccess'),
              })
            } catch (e: unknown) {
              showErrorToast({ error: e })
            }
          }}
        />
      ))}
    </section>
  )
}

function StatusChildCard({
  item,
  onReminder,
  isPending,
}: {
  item: {
    organizationChildId: string | null
    privateChildId: string | null
    childName: string
    className: string
    statusLabel: string
    canSendReminder: boolean
  }
  onReminder: () => void
  isPending: boolean
}) {
  const t = useTranslations('evaluations.organization')

  return (
    <Card className="rounded-2xl border bg-card shadow-sm hover:border-brand-navy/20 transition-all duration-300">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 rounded-xl shrink-0 border border-slate-100 dark:border-slate-800">
            <AvatarImage
              src="/avatar-placeholder.svg"
              alt={item.childName}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl text-xs font-bold bg-brand-navy/10 text-brand-navy">
              CH
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-end text-sm space-y-1">
            <p className="font-bold text-slate-900 dark:text-slate-50 truncate">{item.childName}</p>
            <p className="text-muted-foreground text-xs font-medium truncate">{item.className}</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
              {item.statusLabel}
            </p>
          </div>
        </div>
        <Button
          variant="gradient"
          className="h-10 w-full rounded-xl font-bold shadow-sm"
          disabled={!item.canSendReminder || isPending}
          onClick={onReminder}
        >
          {t('sendReminder')}
        </Button>
      </CardContent>
    </Card>
  )
}

export function OwnerEvaluationResultsScreen({ locale }: Props) {
  const t = useTranslations('evaluations.organization')
  const tCommon = useTranslations('common')

  const filtersQuery = useOwnerEvaluationFilters()
  const [classId, setClassId] = useState<string | null>(null)
  const [evaluationId, setEvaluationId] = useState<string | null>(null)

  const classes = filtersQuery.data?.classes ?? []
  const evaluations = filtersQuery.data?.evaluations ?? []

  const effectiveClassId = classId ?? classes[0]?.id ?? ''
  const effectiveEvaluationId = evaluationId ?? evaluations[0]?.id ?? ''

  const filtersReady = !filtersQuery.isLoading && !filtersQuery.isError

  return (
    <main
      className="min-h-screen py-8 space-y-8 bg-slate-50/50 dark:bg-background"
      dir={getTextDirection(locale)}
    >
      <div className="app-container space-y-6">
        <ManagementPageHeader
          breadcrumbs={[
            {
              href: '/dashboards/organization',
              label: tCommon('home'),
            },
            { label: t('results') },
          ]}
          title={t('results')}
          subtitle={t('subtitle')}
        />

        {filtersQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : filtersQuery.isError ? (
          <QueryError
            message={t('error')}
            onRetry={() => void filtersQuery.refetch()}
            retryLabel={t('retry')}
          />
        ) : (
          <FiltersBar
            classId={effectiveClassId}
            evaluationId={effectiveEvaluationId}
            onClassChange={setClassId}
            onEvaluationChange={setEvaluationId}
            classes={classes}
            evaluations={evaluations}
          />
        )}

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-3 bg-slate-100/80 dark:bg-slate-900 p-1.5 rounded-2xl">
            <TabsTrigger
              value="reports"
              className="h-11 rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:text-brand-purple data-[state=active]:shadow-sm transition-all"
            >
              {t('reportsTab')}
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="h-11 rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:text-brand-purple data-[state=active]:shadow-sm transition-all"
            >
              {t('resultsTab')}
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="h-11 rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:text-brand-purple data-[state=active]:shadow-sm transition-all"
            >
              {t('statusTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="pt-6 focus-visible:outline-none">
            {filtersReady ? (
              <ReportsTab locale={locale} evaluationId={effectiveEvaluationId} />
            ) : null}
          </TabsContent>

          <TabsContent value="results" className="pt-6 focus-visible:outline-none">
            {filtersReady ? (
              <ResultsTab classId={effectiveClassId} evaluationId={effectiveEvaluationId} />
            ) : null}
          </TabsContent>

          <TabsContent value="status" className="pt-6 focus-visible:outline-none">
            {filtersReady ? (
              <StatusTab
                locale={locale}
                classId={effectiveClassId}
                evaluationId={effectiveEvaluationId}
              />
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
