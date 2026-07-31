'use client'

import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { DataTablePagination } from '@/components/shared/data-table/DataTablePagination'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { getFriendlyApiErrorMessage, getFieldError } from '@/lib/helpers/apiErrorMessages'
import { ApprovalStatus, StatusCode } from '@/lib/types/enums'
import { ApiError } from '@/lib/errors/ApiError'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { ColumnDef } from '@tanstack/react-table'

import { useApproveOrganization, useOrganizationsList, useRejectOrganization } from '../hooks'
import { createRejectionReasonSchema } from '../schemas/rejection.schema'
import type { Organization } from '../types/interfaces'
import { OrganizationApprovalBadge } from './OrganizationApprovalBadge'

type StatusFilter = ApprovalStatus

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

export function AdminOrganizationsScreen({ locale }: { locale: string }) {
  const t = useTranslations('organizations.admin')
  const tTypes = useTranslations('organizations.types')
  const tValidation = useTranslations('organizations.validation.rejectReason')
  const isAr = locale === 'ar'

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ApprovalStatus.PENDING)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search, 300)
  const [approveTarget, setApproveTarget] = useState<Organization | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Organization | null>(null)

  useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedSearch])

  const { data, isLoading, isFetching, isError, error, refetch } = useOrganizationsList({
    status: statusFilter,
    search: debouncedSearch,
    page,
    limit: 20,
  })

  const approveMutation = useApproveOrganization()
  const rejectMutation = useRejectOrganization()

  const rejectionSchema = useMemo(
    () => createRejectionReasonSchema((key) => tValidation(key)),
    [tValidation],
  )

  const rejectionForm = useForm({
    resolver: zodResolver(rejectionSchema),
    defaultValues: { rejectionReason: '' },
  })

  const organizations = data?.items ?? []
  const meta = data?.meta

  const columns = useMemo<ColumnDef<Organization>[]>(
    () => [
      {
        accessorKey: 'organizationName',
        header: t('columns.name'),
      },
      {
        accessorKey: 'organizationType',
        header: t('columns.type'),
        cell: ({ row }) => tTypes(row.original.organizationType),
      },
      {
        id: 'ownerName',
        header: t('columns.owner'),
        cell: ({ row }) => row.original.owner?.name ?? '—',
      },
      {
        id: 'ownerEmail',
        header: t('columns.email'),
        cell: ({ row }) => row.original.owner?.email ?? '—',
      },
      {
        accessorKey: 'approvalStatus',
        header: t('columns.status'),
        cell: ({ row }) => <OrganizationApprovalBadge status={row.original.approvalStatus} />,
      },
      {
        id: 'submittedAt',
        header: t('columns.submitted'),
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: 'reviewedAt',
        header: t('columns.reviewed'),
        cell: ({ row }) => formatDate(row.original.approvedAt ?? row.original.rejectedAt),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => {
          const org = row.original

          if (org.approvalStatus === ApprovalStatus.PENDING) {
            return (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setApproveTarget(org)}
                  aria-label={t('approveAria', { name: org.organizationName })}
                >
                  <Check className="size-4" />
                  {t('approve')}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    rejectionForm.reset({ rejectionReason: '' })
                    setRejectTarget(org)
                  }}
                  aria-label={t('rejectAria', { name: org.organizationName })}
                >
                  <X className="size-4" />
                  {t('reject')}
                </Button>
              </div>
            )
          }

          if (org.approvalStatus === ApprovalStatus.REJECTED && org.rejectionReason) {
            return <p className="max-w-xs text-xs text-muted-foreground">{org.rejectionReason}</p>
          }

          return <span className="text-xs text-muted-foreground">—</span>
        },
      },
    ],
    [rejectionForm, t, tTypes],
  )

  async function handleApprove() {
    if (!approveTarget) return

    try {
      await approveMutation.mutateAsync(approveTarget.id)
      showSuccessToast(t, 'approveSuccess')
      setApproveTarget(null)
    } catch (err) {
      showErrorToast({ error: err })
    }
  }

  async function handleReject(values: { rejectionReason: string }) {
    if (!rejectTarget) return

    try {
      await rejectMutation.mutateAsync({
        id: rejectTarget.id,
        rejectionReason: values.rejectionReason,
      })
      showSuccessToast(t, 'rejectSuccess')
      setRejectTarget(null)
      rejectionForm.reset({ rejectionReason: '' })
    } catch (err) {
      const fieldError = getFieldError(err, 'rejectionReason')
      if (fieldError) {
        rejectionForm.setError('rejectionReason', { message: fieldError })
      }
      showErrorToast({ error: err })
    }
  }

  const emptyMessage =
    debouncedSearch.trim().length > 0
      ? t('filters.noSearchResults')
      : statusFilter === ApprovalStatus.PENDING
        ? t('empty.pending')
        : statusFilter === ApprovalStatus.APPROVED
          ? t('empty.approved')
          : t('empty.rejected')

  return (
    <>
      <SiteHeader titleKey="organizations.admin.title" />
      <div className="flex flex-1 flex-col" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{t('title')}</h2>
            <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>

          <Tabs
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <TabsList>
              <TabsTrigger value={ApprovalStatus.PENDING}>{t('tabs.pending')}</TabsTrigger>
              <TabsTrigger value={ApprovalStatus.APPROVED}>{t('tabs.approved')}</TabsTrigger>
              <TabsTrigger value={ApprovalStatus.REJECTED}>{t('tabs.rejected')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative max-w-md">
            <Search className="absolute inset-y-0 inset-s-3 my-auto size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('filters.searchPlaceholder')}
              aria-label={t('filters.searchPlaceholder')}
              className="rounded-xl ps-9"
            />
          </div>

          {isError ? (
            <ErrorCard
              message={
                error instanceof ApiError && error.status === StatusCode.FORBIDDEN
                  ? t('errors.forbidden')
                  : getFriendlyApiErrorMessage(error, t('errors.loadFailed'))
              }
              retry={{ label: t('retry'), onClick: () => refetch() }}
            />
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : organizations.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="space-y-4">
              {isFetching ? (
                <p className="text-xs text-muted-foreground">{t('filters.searching')}</p>
              ) : null}
              <DataTable data={organizations} columns={columns} />
              {meta ? (
                <DataTablePagination meta={meta} onPageChange={setPage} />
              ) : null}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(approveTarget)}
        onOpenChange={(open) => !open && setApproveTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('approveDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('approveDialog.description', {
                name: approveTarget?.organizationName ?? '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveTarget(null)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleApprove} disabled={approveMutation.isPending}>
              {t('approve')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null)
            rejectionForm.reset({ rejectionReason: '' })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rejectDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('rejectDialog.description', {
                name: rejectTarget?.organizationName ?? '',
              })}
            </DialogDescription>
          </DialogHeader>

          <Form {...rejectionForm}>
            <form onSubmit={rejectionForm.handleSubmit(handleReject)} className="space-y-4">
              <FormField
                control={rejectionForm.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('rejectDialog.reasonLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder={t('rejectDialog.reasonPlaceholder')}
                        aria-describedby="rejection-reason-help"
                      />
                    </FormControl>
                    <p id="rejection-reason-help" className="text-xs text-muted-foreground">
                      {t('rejectDialog.reasonHelp')}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRejectTarget(null)
                    rejectionForm.reset({ rejectionReason: '' })
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="destructive" disabled={rejectMutation.isPending}>
                  {t('reject')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
