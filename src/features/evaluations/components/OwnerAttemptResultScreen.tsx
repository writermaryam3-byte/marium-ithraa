'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import AttemptSummary from '@/features/evaluations/components/AttemptSummary'
import { AttemptResultView } from '@/features/evaluations/components/results/AttemptResultView'
import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAttempt } from '@/features/evaluations/hooks'
import { Link } from '@/i18n/navigation'
import { ApiError } from '@/lib/errors/ApiError'
import { StatusCode } from '@/lib/types/enums'
import { getTextDirection } from '@/lib/i18n/locale-utils'

function isForbiddenError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === StatusCode.FORBIDDEN || error.status === StatusCode.UNAUTHORIZED)
}

export function OwnerAttemptResultScreen() {
  const locale = useLocale()
  const params = useParams<{ attemptId: string }>()
  const attemptId = params.attemptId ?? ''
  const t = useTranslations('organizations.organizationEvaluations')
  const tEval = useTranslations('evaluations')
  const tCommon = useTranslations('common')

  const { data: attempt, isLoading, isError, error, refetch } = useAttempt(attemptId)

  const breadcrumbs = [
    {
      href: '/dashboards/organization',
      label: tCommon('general.home'),
    },
    {
      href: '/dashboards/organization/results',
      label: t('results'),
    },
    { label: t('attemptResult') },
  ]

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface py-8" dir={getTextDirection(locale)}>
        <div className="app-container space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </main>
    )
  }

  if (isError) {
    const forbidden = isForbiddenError(error)
    return (
      <main className="min-h-screen bg-surface py-8" dir={getTextDirection(locale)}>
        <div className="app-container space-y-6">
          <ManagementPageHeader breadcrumbs={breadcrumbs} title={t('attemptResult')} />
          <Card className="rounded-2xl border bg-white">
            <CardContent className="py-10 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {forbidden ? t('attemptForbidden') : t('error')}
              </p>
              {!forbidden && (
                <Button variant="outline" size="sm" onClick={() => void refetch()}>
                  {t('retry')}
                </Button>
              )}
              <div>
                <Button variant="link" asChild>
                  <Link href="/dashboards/organization/results">{t('backToResults')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!attempt) {
    return (
      <main className="min-h-screen bg-surface py-8" dir={getTextDirection(locale)}>
        <div className="app-container space-y-6">
          <ManagementPageHeader breadcrumbs={breadcrumbs} title={t('attemptResult')} />
          <Card className="rounded-2xl border bg-white">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {tEval('attemptNotFound')}
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const status = attempt.status?.toLowerCase() ?? ''
  const evaluationType = attempt.evaluation?.type ?? 'multiple_intelligences'

  return (
    <main className="min-h-screen bg-surface py-8" dir={getTextDirection(locale)}>
      <div className="app-container space-y-6">
        <ManagementPageHeader
          breadcrumbs={breadcrumbs}
          title={attempt.evaluation?.title ?? t('attemptResult')}
          subtitle={attempt.child?.name}
        />

        <AttemptSummary attempt={attempt} />

        {status === 'approved' ? (
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{tEval('result')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AttemptResultView
                type={evaluationType}
                result={attempt.result}
                title={attempt.evaluation?.title}
              />
            </CardContent>
          </Card>
        ) : status === 'submitted' ? (
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {t('attemptNotApproved')}
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {t('attemptNoResultYet')}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
