'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'
import { Baby, Loader2, Plus } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type ClassItem } from '@/features/classes'
import { type Child, deleteChildAction, type DeleteChildState } from '@/features/children'
import { formatChildBirthDate, getChildEvaluationLabel } from '@/features/children/utils/display'
import { useActionFeedback } from '@/hooks/useActionFeedback'
import { getTextDirection } from '@/lib/i18n/locale-utils'

type Props = {
  classItem: ClassItem
  classChildren: Child[]
}

export function ClassDetailScreen({ classItem, classChildren }: Props) {
  const locale = useLocale()
  const t = useTranslations('organizations.classDetail')
  const tChildren = useTranslations('children')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('navigation.organization')
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null)
  const { notifyDelete } = useActionFeedback()

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteChildState, FormData>(
    deleteChildAction,
    { success: false },
  )

  useEffect(() => {
    if (deleteState.success) {
      notifyDelete(deleteState, 'Actions.children.deleted')
      queueMicrotask(() => setDeleteTarget(null))
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, notifyDelete])

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: tCommon('general.home') },
          { href: '/dashboards/organization/classes', label: tNav('classes') },
          { label: classItem.name },
        ]}
        title={classItem.name}
        subtitle={t('gradeSubtitle', { grade: classItem.gradeName ?? '—' })}
        action={{
          label: t('addChild'),
          href: `/dashboards/organization/children/new?classId=${classItem.id}&gradeId=${classItem.gradeId}`,
          icon: <Plus />,
        }}
      />

      {classChildren.length === 0 ? (
        <EmptyState
          title={t('empty')}
          actionLabel={t('addChild')}
          actionHref={`/dashboards/organization/children/new?classId=${classItem.id}&gradeId=${classItem.gradeId}`}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classChildren.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, tChildren)
            return (
              <Card key={child.id} className="rounded-2xl">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="size-4 text-fuchsia-600" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('birth')}: {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>{evalInfo.label}</p>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="rounded-xl flex-1" asChild>
                      <Link href={`/dashboards/organization/children/${child.id}`}>
                        {tCommon('edit')}
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      type="button"
                      onClick={() => setDeleteTarget(child)}
                    >
                      {tCommon('delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>{tCommon('confirmDelete')}</DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <form action={deleteAction}>
              <input type="hidden" name="id" value={deleteTarget.id} />
              <Button
                type="submit"
                variant="destructive"
                disabled={isDeleting}
                className="w-full rounded-xl"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : tCommon('delete')}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
