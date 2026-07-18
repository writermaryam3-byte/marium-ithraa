'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { GraduationCap, Layers3, Loader2, Plus, Users } from 'lucide-react'

import { DataTablePagination } from '@/components/shared/data-table/DataTablePagination'
import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EntityCard } from '@/components/shared/management/EntityCard'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { ListFilters } from '@/components/shared/management/ListFilters'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { type Grade, deleteGradeAction, type DeleteGradeState } from '@/features/grades'
import { useClientPagination } from '@/hooks/useClientPagination'
import { useActionFeedback } from '@/hooks/useActionFeedback'

import { UpdateGradeDialog } from './UpdateGradeDialog'

export function GradesScreen({ grades }: { grades: Grade[] }) {
  const locale = useLocale()
  const t = useTranslations('organizations.grades')
  const tCommon = useTranslations('common')
  const tPagination = useTranslations('pagination')
  const { notifyDelete } = useActionFeedback()
  const [search, setSearch] = useState('')

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteGradeState, FormData>(
    deleteGradeAction,
    { success: false },
  )

  useEffect(() => {
    if (deleteState.success) {
      notifyDelete(deleteState, 'grades.deleted')
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, notifyDelete])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return grades
    return grades.filter((g) => g.name.toLowerCase().includes(q))
  }, [grades, search])

  const { pageItems, pagination, setPage, resetPage } = useClientPagination(filtered, 12)

  return (
    <main className="app-container py-8 space-y-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: tCommon('general.home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('description')}
        action={{
          label: t('actions.add'),
          href: '/dashboards/organization/grades/new',
          icon: <Plus />,
        }}
      />

      <ListFilters
        locale={locale}
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          resetPage()
        }}
        searchPlaceholder={t('filters.searchPlaceholder')}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={tCommon('empty.noData')}
          actionLabel={grades.length === 0 ? t('actions.add') : undefined}
          actionHref={grades.length === 0 ? '/dashboards/organization/grades/new' : undefined}
        />
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((grade) => (
              <EntityCard
                key={grade.id}
                editLabel={tCommon('buttons.edit')}
                deleteLabel={tCommon('buttons.delete')}
                fields={[
                  {
                    label: t('fields.name'),
                    value: (
                      <Link
                        href={`/dashboards/organization/grades/${grade.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {grade.name}
                      </Link>
                    ),
                    icon: <GraduationCap />,
                  },
                  {
                    label: t('fields.classesCount'),
                    value: String(grade.classesCount ?? grade.classes?.length ?? 0),
                    icon: <Layers3 />,
                  },
                  {
                    label: t('fields.childrenCount'),
                    value: String(grade.childrenCount ?? '—'),
                    icon: <Users />,
                  },
                ]}
                renderEditDialog={({ open, onClose }) => (
                  <UpdateGradeDialog
                    open={open}
                    onOpenChange={(v) => !v && onClose()}
                    gradeId={grade.id}
                    gradeName={grade.name}
                  />
                )}
                renderDeleteDialog={({ open, onClose }) => (
                  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>{t('dialogs.deleteTitle')}</DialogTitle>
                        <DialogDescription>{tCommon('general.confirmDelete')}</DialogDescription>
                      </DialogHeader>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={grade.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          className="w-full rounded-xl"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            tCommon('buttons.delete')
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              />
            ))}
          </section>
          {pagination.totalPages > 1 && (
            <DataTablePagination
              meta={pagination}
              onPageChange={setPage}
              labels={{
                previous: tPagination('previous'),
                next: tPagination('next'),
                page: tPagination('page'),
              }}
            />
          )}
        </>
      )}
    </main>
  )
}
