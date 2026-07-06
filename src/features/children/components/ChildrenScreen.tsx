'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Baby,
  Calendar,
  GraduationCap,
  Layers3,
  Loader2,
  Mail,
  Phone,
  UserRoundPlus,
} from 'lucide-react'

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
import { type Child } from '@/features/children'
import {
  deleteChildAction,
  type DeleteChildState,
} from '@/features/children/actions/delete-child.action'
import { type ClassItem } from '@/features/classes'
import { type Grade } from '@/features/grades'
import {
  childMatchesSearch,
  formatChildBirthDate,
  getChildClassName,
  getChildEvaluationLabel,
  getChildGradeName,
} from '@/features/children/utils/display'
import { useClientPagination } from '@/hooks/useClientPagination'
import { useActionFeedback } from '@/hooks/useActionFeedback'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Gender } from '@/lib/types/enums'

import { UpdateChildDialog } from './UpdateChildDialog'

type Props = {
  childrens: Child[]
  grades: Grade[]
  classes: ClassItem[]
}

export function ChildrenScreen({ childrens, grades, classes }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Children')
  const tCommon = useTranslations('Dashboard.common')
  const tPagination = useTranslations('Dashboard.pagination')
  const { notifyDelete } = useActionFeedback()
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [classFilter, setClassFilter] = useState('')

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteChildState, FormData>(
    deleteChildAction,
    { success: false },
  )

  useEffect(() => {
    if (deleteState.success) {
      notifyDelete(deleteState, 'Actions.children.deleted')
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, notifyDelete])

  const classOptionsForGrade = useMemo(() => {
    if (!gradeFilter) return classes
    return classes.filter((c) => c.gradeId === gradeFilter)
  }, [classes, gradeFilter])

  const filtered = useMemo(() => {
    return childrens.filter((child) => {
      if (!childMatchesSearch(child, search)) return false
      if (gradeFilter) {
        const gId =
          child.gradeId ??
          (typeof child.grade === 'object' ? child.grade?.id : undefined) ??
          child.class?.gradeId
        const gName = getChildGradeName(child)
        const grade = grades.find((gr) => gr.id === gradeFilter)
        if (gId !== gradeFilter && gName !== grade?.name) return false
      }
      if (classFilter) {
        const cId = child.classId ?? child.class?.id
        if (cId !== classFilter) return false
      }
      return true
    })
  }, [childrens, search, gradeFilter, classFilter, grades])

  const { pageItems, pagination, setPage, resetPage } = useClientPagination(filtered, 12)

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: tCommon('home') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
        action={{
          label: t('actions.add'),
          href: '/dashboards/organization/children/new',
          icon: <UserRoundPlus />,
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
          onChange: (v) => {
            setGradeFilter(v)
            setClassFilter('')
            resetPage()
          },
          options: grades.map((g) => ({ value: g.id, label: g.name })),
          label: t('gradeFilter'),
          allLabel: t('allGrades'),
        }}
        classFilter={{
          value: classFilter,
          onChange: (value) => {
            setClassFilter(value)
            resetPage()
          },
          options: classOptionsForGrade.map((c) => ({
            value: c.id,
            label: c.name,
          })),
          label: t('classFilter'),
          allLabel: t('allClasses'),
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={tCommon('noData')}
          actionLabel={childrens.length === 0 ? t('actions.add') : undefined}
          actionHref={childrens.length === 0 ? '/dashboards/organization/children/new' : undefined}
        />
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((child) => {
              const evalInfo = getChildEvaluationLabel(child, t)
              const genderLabel =
                child.gender === Gender.MALE
                  ? t('gender.male')
                  : child.gender === Gender.FEMALE
                    ? t('gender.female')
                    : (child.gender ?? '—')

              return (
                <EntityCard
                  key={child.id}
                  editLabel={tCommon('edit')}
                  deleteLabel={tCommon('delete')}
                  fields={[
                    {
                      label: t('fields.name'),
                      value: child.name,
                      icon: <Baby />,
                    },
                    {
                      label: t('fields.birthDate'),
                      value: formatChildBirthDate(child.birthDate, locale),
                      icon: <Calendar />,
                    },
                    {
                      label: t('fields.gender'),
                      value: genderLabel,
                    },
                    {
                      label: t('fields.grade'),
                      value: getChildGradeName(child),
                      icon: <GraduationCap />,
                    },
                    {
                      label: t('fields.class'),
                      value: getChildClassName(child),
                      icon: <Layers3 />,
                    },
                    ...(child.parent?.name
                      ? [
                          {
                            label: t('fields.parent'),
                            value: child.parent.name,
                          },
                        ]
                      : []),
                    ...(child.parent?.email
                      ? [
                          {
                            label: t('fields.email'),
                            value: child.parent.email,
                            icon: <Mail />,
                          },
                        ]
                      : []),
                    ...(child.parent?.phone
                      ? [
                          {
                            label: t('fields.phone'),
                            value: child.parent.phone,
                            icon: <Phone />,
                          },
                        ]
                      : []),
                    {
                      label: t('fields.evaluation'),
                      value: evalInfo.label,
                      valueClassName: evalInfo.className,
                    },
                    ...(child.attemptsUsed != null
                      ? [
                          {
                            label: t('fields.attempts'),
                            value: String(child.attemptsUsed),
                          },
                        ]
                      : []),
                  ]}
                  renderEditDialog={({ open, onClose }) => (
                    <UpdateChildDialog
                      open={open}
                      onOpenChange={(v) => !v && onClose()}
                      childId={child.id}
                      childName={child.name}
                      birthDate={child.birthDate ?? ''}
                      gender={(child.gender as Gender) ?? Gender.MALE}
                    />
                  )}
                  renderDeleteDialog={({ open, onClose }) => (
                    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle>{t('dialog.deleteTitle')}</DialogTitle>
                          <DialogDescription>{t('dialog.deleteConfirmShort')}</DialogDescription>
                        </DialogHeader>
                        <form action={deleteAction}>
                          <input type="hidden" name="id" value={child.id} />
                          <Button
                            type="submit"
                            variant="destructive"
                            className="w-full rounded-xl"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {tCommon('deleting')}
                              </>
                            ) : (
                              tCommon('delete')
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                />
              )
            })}
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
