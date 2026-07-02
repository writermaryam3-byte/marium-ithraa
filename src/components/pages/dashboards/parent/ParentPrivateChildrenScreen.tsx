'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Baby, Calendar, Plus } from 'lucide-react'

import { ParentPrivateChildDialog } from './ParentPrivateChildDialog'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type Child } from '@/features/children'
import { formatChildBirthDate, getChildEvaluationLabel } from '@/features/children/utils/display'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Link } from '@/i18n/navigation'

const PRIVATE_CHILD_LIMIT = 2

type Props = {
  privateChildren: Child[]
}

export function ParentPrivateChildrenScreen({ privateChildren }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Parent.privateChildren')
  const tParent = useTranslations('Dashboard.Parent')
  const tChildren = useTranslations('Dashboard.Children')
  const tCommon = useTranslations('Dashboard.common')
  const tDashboard = useTranslations('Dashboard.common')
  const [open, setOpen] = useState(false)
  const atLimit = privateChildren.length >= PRIVATE_CHILD_LIMIT

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/parent', label: tDashboard('home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle', { limit: PRIVATE_CHILD_LIMIT })}
      />

      {atLimit && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t('limitReached')}
        </p>
      )}

      {/* <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient"
              type="button"
              className="rounded-xl gap-2"
              disabled={atLimit}
            >
              <Plus className="size-4" />
              {t("addChild")}
            </Button>
          </DialogTrigger>
          <ParentPrivateChildDialog
            open={open}
            onOpenChange={setOpen}
            currentCount={privateChildren.length}
            onSuccess={() => {}}
          />
        </Dialog>
      </div> */}
      {/* تم إزالة <Dialog> الخارجي و <DialogTrigger> */}
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

        {/* الـ Dialog يتم استدعاؤه كـ Component منفصل هنا */}
        <ParentPrivateChildDialog
          open={open}
          onOpenChange={setOpen}
          currentCount={privateChildren.length}
          onSuccess={() => {}}
        />
      </div>

      {privateChildren.length === 0 ? (
        <EmptyState title={t('empty')} actionLabel={!atLimit ? t('addChild') : undefined} />
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
                    {tParent('retake')}: {child.retakeUsed ? tCommon('yes') : tCommon('no')}
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
    </main>
  )
}
