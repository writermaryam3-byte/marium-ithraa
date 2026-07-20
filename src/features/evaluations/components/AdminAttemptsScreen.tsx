'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { EntityCombobox } from '@/components/shared/forms/EntityCombobox'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { DataTablePagination } from '@/components/shared/data-table/DataTablePagination'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { lookupChildren, lookupEvaluations } from '@/features/admin-lookup/api'
import type { LookupOption } from '@/features/admin-lookup/types'
import { attemptColumns } from '@/features/evaluations/components/attempt-columns'
import { useAttempts } from '@/features/evaluations/hooks'
import type { EvaluationAttempt } from '@/features/evaluations/types'

type Props = { locale: string }

const ALL = 'all'

export function AdminAttemptsScreen({ locale }: Props) {
  const t = useTranslations('evaluations')
  const isAr = locale === 'ar'
  const [status, setStatus] = useState(ALL)
  const [page, setPage] = useState(1)
  const [evaluationId, setEvaluationId] = useState<string>()
  const [organizationChildId, setOrganizationChildId] = useState<string>()
  const [privateChildId, setPrivateChildId] = useState<string>()
  const [selectedEvaluation, setSelectedEvaluation] = useState<LookupOption | null>(null)
  const [selectedOrgChild, setSelectedOrgChild] = useState<LookupOption | null>(null)
  const [selectedPrivateChild, setSelectedPrivateChild] = useState<LookupOption | null>(null)

  useEffect(() => {
    setPage(1)
  }, [status, evaluationId, organizationChildId, privateChildId])

  const filters = useMemo(
    () => ({
      status: status === ALL ? undefined : status,
      evaluationId,
      organizationChildId,
      privateChildId,
      page,
      limit: 20,
    }),
    [status, evaluationId, organizationChildId, privateChildId, page],
  )

  const { data, isLoading, isError, refetch } = useAttempts(filters)
  const attempts: EvaluationAttempt[] = data?.items ?? []
  const meta = data?.meta

  const fetchEvaluations = useCallback(
    (params: { search: string; page: number }) =>
      lookupEvaluations({ search: params.search, page: params.page, limit: 20 }),
    [],
  )

  const fetchOrgChildren = useCallback(
    (params: { search: string; page: number }) =>
      lookupChildren({ search: params.search, page: params.page, limit: 20, type: 'organization' }),
    [],
  )

  const fetchPrivateChildren = useCallback(
    (params: { search: string; page: number }) =>
      lookupChildren({ search: params.search, page: params.page, limit: 20, type: 'private' }),
    [],
  )

  return (
    <div className="space-y-4 px-4 lg:px-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label>{t('filters.status')}</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('allStatuses')}</SelectItem>
              <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
              <SelectItem value="submitted">{t('submitted')}</SelectItem>
              <SelectItem value="approved">{t('approved')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('filters.evaluation')}</Label>
          <EntityCombobox
            value={evaluationId}
            selectedOption={selectedEvaluation}
            onValueChange={(value, option) => {
              setEvaluationId(value)
              setSelectedEvaluation(option ?? null)
            }}
            placeholder={t('filters.selectEvaluation')}
            searchPlaceholder={t('filters.searchEvaluation')}
            ariaLabel={t('filters.selectEvaluation')}
            fetchOptions={fetchEvaluations}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('filters.organizationChild')}</Label>
          <EntityCombobox
            value={organizationChildId}
            selectedOption={selectedOrgChild}
            onValueChange={(value, option) => {
              setOrganizationChildId(value)
              setSelectedOrgChild(option ?? null)
            }}
            placeholder={t('filters.selectOrganizationChild')}
            searchPlaceholder={t('filters.searchOrganizationChild')}
            ariaLabel={t('filters.selectOrganizationChild')}
            fetchOptions={fetchOrgChildren}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('filters.privateChild')}</Label>
          <EntityCombobox
            value={privateChildId}
            selectedOption={selectedPrivateChild}
            onValueChange={(value, option) => {
              setPrivateChildId(value)
              setSelectedPrivateChild(option ?? null)
            }}
            placeholder={t('filters.selectPrivateChild')}
            searchPlaceholder={t('filters.searchPrivateChild')}
            ariaLabel={t('filters.selectPrivateChild')}
            fetchOptions={fetchPrivateChildren}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : isError ? (
        <div className="space-y-2">
          <p className="text-sm text-destructive">{t('error')}</p>
          <button type="button" className="text-sm underline" onClick={() => void refetch()}>
            {t('retry')}
          </button>
        </div>
      ) : attempts.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-4">
          <DataTable data={attempts} columns={attemptColumns} />
          {meta ? <DataTablePagination meta={meta} onPageChange={setPage} /> : null}
        </div>
      )}
    </div>
  )
}
