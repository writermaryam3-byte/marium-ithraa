'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Baby, Calendar, Plus } from 'lucide-react'

import { ParentPrivateChildDialog } from './ParentPrivateChildDialog'
import { ParentCapacityRequestDialog } from './ParentCapacityRequestDialog'
import { ParentApprovedCapacityBanner } from './ParentApprovedCapacityBanner'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type Child } from '@/features/children'
import { formatChildBirthDate, getChildEvaluationLabel } from '@/features/children/utils/display'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'
import type { ParentProfileSummary } from '@/features/parent'
import { parentProfileKeys } from '@/features/parent'

type Props = {
  privateChildren: Child[]
  profile: ParentProfileSummary
}

export function ParentPrivateChildrenScreen({ privateChildren, profile }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()
  const t = useTranslations('dashboard.parent.privateChildren')
  const tParent = useTranslations('dashboard.parent')
  const tChildren = useTranslations('children')
  const tCommon = useTranslations('common')
  const tDashboard = useTranslations('common')
  const [open, setOpen] = useState(false)
  const [capacityOpen, setCapacityOpen] = useState(false)
  const maxChildren = profile.maxChildren
  const atLimit = privateChildren.length >= maxChildren

  const handleChildAdded = () => {
    void queryClient.invalidateQueries({ queryKey: parentProfileKeys.me })
    router.refresh()
  }

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/parent', label: tDashboard('home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle', { limit: maxChildren })}
      />

      <ParentApprovedCapacityBanner />

      {atLimit && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('limitReached', { limit: maxChildren })}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => setCapacityOpen(true)}>
            {t('requestCapacity')}
          </Button>
        </div>
      )}

      {/* Add-child dialog */}
      <div className="flex justify-end">
        <Button
          variant="gradient"
          type="button"
          className="rounded-xl gap-2"
          disabled={atLimit}
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          {t('addChild')}
        </Button>
      </div>

      {privateChildren.length === 0 ? (
        <EmptyState
          title={t('empty')}
          actionLabel={!atLimit ? t('addChild') : undefined}
          onActionClick={!atLimit ? () => setOpen(true) : undefined}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {privateChildren.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, tChildren)
            return (
              <Card key={child.id} className="rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="text-fuchsia-600 size-4" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className="text-sm">
                    {tParent('attempts')}: {child.attemptsUsed ?? 0}
                  </p>
                  <p className="text-sm">
                    {tParent('retake')}: {child.retakeUsed ? tCommon('yesNo.yes') : tCommon('yesNo.no')}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>{evalInfo.label}</p>
                  <Button variant="outline" size="sm" className="mt-2 rounded-xl" asChild>
                    <Link href={`/dashboards/parent/children/${child.id}/evaluations`}>
                      {tParent('evaluationsLink')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      <ParentPrivateChildDialog
        open={open}
        onOpenChange={setOpen}
        currentCount={privateChildren.length}
        maxChildren={maxChildren}
        onSuccess={handleChildAdded}
      />
      <ParentCapacityRequestDialog open={capacityOpen} onOpenChange={setCapacityOpen} />
    </main>
  )
}
