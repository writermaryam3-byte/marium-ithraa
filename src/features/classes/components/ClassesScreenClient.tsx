'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Layers3, Loader2, Plus, School, Users } from 'lucide-react'

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
import { type ClassItem, deleteClassAction, type DeleteClassState } from '@/features/classes'
import { type Grade } from '@/features/grades'
import { useClientPagination } from '@/hooks/useClientPagination'
import { useActionFeedback } from '@/hooks/useActionFeedback'

import { UpdateClassDialog } from './UpdateClassDialog'

type Props = {
  classes: ClassItem[]
  grades: Grade[]
}

export function ClassesScreenClient({ classes, grades }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Classes')
  const tCommon = useTranslations('Dashboard.common')
  const tPagination = useTranslations('Dashboard.pagination')
  const { notifyDelete } = useActionFeedback()
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteClassState, FormData>(
    deleteClassAction,
    { success: false },
  )

  useEffect(() => {
    if (deleteState.success) {
      notifyDelete(deleteState, 'classes.deleted')
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, notifyDelete])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return classes.filter((c) => {
      if (gradeFilter && c.gradeId !== gradeFilter) return false
      if (q && !c.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [classes, search, gradeFilter])

  const { pageItems, pagination, setPage, resetPage } = useClientPagination(filtered, 12)

  return (
    <main className="app-container py-8 space-y-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: tCommon('home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
        action={{
          label: t('add'),
          href: '/dashboards/organization/classes/new',
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
        searchPlaceholder={t('searchPlaceholder')}
        gradeFilter={{
          value: gradeFilter,
          onChange: (value) => {
            setGradeFilter(value)
            resetPage()
          },
          options: grades.map((g) => ({ value: g.id, label: g.name })),
          label: t('gradeFilter'),
          allLabel: t('allGrades'),
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={tCommon('noData')}
          actionLabel={classes.length === 0 ? t('add') : undefined}
          actionHref={classes.length === 0 ? '/dashboards/organization/classes/new' : undefined}
        />
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((c) => (
              <EntityCard
                key={c.id}
                editLabel={tCommon('edit')}
                deleteLabel={tCommon('delete')}
                fields={[
                  {
                    label: t('fields.name'),
                    value: (
                      <Link
                        href={`/dashboards/organization/classes/${c.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {c.name}
                      </Link>
                    ),
                    icon: <Layers3 />,
                  },
                  {
                    label: t('fields.grade'),
                    value: c.gradeName ?? t('fields.unassigned'),
                    icon: <School />,
                  },
                  {
                    label: t('fields.teacher'),
                    value: c.teacherName ?? t('fields.unassigned'),
                  },
                  {
                    label: t('fields.students'),
                    value: String(c.childrenCount ?? 0),
                    icon: <Users />,
                  },
                ]}
                renderEditDialog={({ open, onClose }) => (
                  <UpdateClassDialog
                    open={open}
                    onOpenChange={(v) => !v && onClose()}
                    classId={c.id}
                    className={c.name}
                    gradeId={c.gradeId}
                    teacherId={c.teacherId}
                  />
                )}
                renderDeleteDialog={({ open, onClose }) => (
                  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>{t('deleteTitle')}</DialogTitle>
                        <DialogDescription>{tCommon('confirmDelete')}</DialogDescription>
                      </DialogHeader>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          className="w-full rounded-xl"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            tCommon('delete')
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
