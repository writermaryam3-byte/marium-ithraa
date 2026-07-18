'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, Crown, Gift, Package, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getOrganizationDashboardClient } from '@/features/organizations/api'
import plansData from '@/features/payments/plans/plans.json'
import { cn } from '@/lib/utils'

const PLAN_ORDER = ['free', 'basic', 'premium'] as const
type PlanId = (typeof PLAN_ORDER)[number]

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free: <Gift className="h-6 w-6" />,
  basic: <Package className="h-6 w-6" />,
  premium: <Crown className="h-6 w-6" />,
}

const FEATURE_KEYS = ['f1', 'f2', 'f3', 'f4', 'f5'] as const

const WHATSAPP_NUMBER = '966500000000'

export function OrganizationSubscriptionScreen() {
  const locale = useLocale()
  const tDashboard = useTranslations('organizations.dashboard')
  const t = useTranslations('organizations.subscriptionPage')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('navigation.organization')
  const [isYearly, setIsYearly] = useState(true)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['organization-dashboard'],
    queryFn: getOrganizationDashboardClient,
  })

  const plans = useMemo(() => {
    return PLAN_ORDER.map((id) => {
      const meta = plansData.find((plan) => plan.id === id)
      return {
        id,
        priceMonthly: meta?.priceMonthly ?? 0,
        priceYearly: meta?.priceYearly ?? 0,
        isPopular: meta?.isPopular ?? false,
      }
    })
  }, [])

  const currentPlanId = (data?.subscription.planId ?? 'free') as PlanId
  const currentPlanIndex = PLAN_ORDER.indexOf(currentPlanId)

  if (isLoading) {
    return (
      <main className="app-container space-y-8 py-8">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="mx-auto h-10 w-48 rounded-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[28rem] rounded-2xl" />
          ))}
        </div>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="app-container py-8">
        <ErrorCard
          message={tDashboard('loadError')}
          retry={{ label: tDashboard('retry'), onClick: () => void refetch() }}
        />
      </main>
    )
  }

  return (
    <main className="app-container space-y-10 py-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: tCommon('general.home') },
          { label: tNav('subscription') },
        ]}
        title={t('title')}
        subtitle={t('description')}
      />

      <div className="flex items-center justify-center gap-3">
        <span
          className={cn(
            'text-sm font-semibold transition-colors',
            !isYearly ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {t('billingMonthly')}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isYearly}
          aria-label={t('billingYearly')}
          onClick={() => setIsYearly((value) => !value)}
          className="relative h-7 w-14 rounded-full bg-muted p-1 transition-colors hover:bg-muted/80"
        >
          <span
            className={cn(
              'absolute top-1 h-5 w-5 rounded-full bg-primary shadow transition-transform',
              isYearly ? 'start-1' : 'start-8',
            )}
          />
        </button>
        <span
          className={cn(
            'text-sm font-semibold transition-colors',
            isYearly ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {t('billingYearly')}
        </span>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          {t('empty')}
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, index) => {
            const isCurrent = plan.id === currentPlanId
            const price = isYearly ? plan.priceYearly : plan.priceMonthly
            const canUpgrade = index > currentPlanIndex
            const canDowngrade = index < currentPlanIndex && plan.id !== 'free'

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col rounded-2xl border transition-all duration-300 hover:shadow-lg',
                  plan.isPopular && 'border-primary shadow-md lg:scale-[1.02]',
                  isCurrent && 'ring-2 ring-primary/40',
                )}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 gap-1 rounded-full px-3 py-1">
                    <Sparkles className="h-3 w-3" />
                    {t('popularBadge')}
                  </Badge>
                )}

                <CardHeader className="space-y-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {PLAN_ICONS[plan.id]}
                      </div>
                      <div className="space-y-1 text-start">
                        <CardTitle className="text-lg">{t(`plans.${plan.id}.name`)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {t(`plans.${plan.id}.description`)}
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <Badge variant="secondary" className="shrink-0">
                        {t('currentPlan')}
                      </Badge>
                    )}
                  </div>

                  <div className="text-start">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold tabular-nums">{price}</span>
                      <span className="text-sm text-muted-foreground">
                        {isYearly ? t('perYear') : t('perMonth')}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm font-semibold text-start">{t('featuresTitle')}</p>
                  <ul className="space-y-3">
                    {FEATURE_KEYS.map((featureKey) => (
                      <li key={featureKey} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-start">{t(`plans.${plan.id}.features.${featureKey}`)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-2">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full rounded-xl" disabled>
                      {t('currentPlan')}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant={canUpgrade ? 'gradient' : 'outline'}
                      className="w-full rounded-xl"
                    >
                      <a
                        href={buildWhatsAppUrl(
                          t(`plans.${plan.id}.name`),
                          isYearly,
                          canUpgrade ? t('upgrade') : t('downgrade'),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {canUpgrade ? t('upgrade') : canDowngrade ? t('downgrade') : t('contactSales')}
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </section>
      )}
    </main>
  )
}

function buildWhatsAppUrl(planName: string, isYearly: boolean, actionLabel: string) {
  const billing = isYearly ? 'yearly' : 'monthly'
  const message = encodeURIComponent(
    `Hello Ithraa, I would like to ${actionLabel.toLowerCase()} to "${planName}" (${billing} billing).`,
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
