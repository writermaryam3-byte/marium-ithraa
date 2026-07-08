'use client'

import { useMemo, useState } from 'react'

import { getPaginationMeta, paginateArray } from '@/lib/api/pagination'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'

import { DataTable } from '@/components/shared/data-table/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { evaluationColumns } from '@/features/evaluations/components/columns'
import type { Evaluation, EvaluationType } from '@/features/evaluations/types'
import { EVALUATION_TYPE_LABELS } from '@/features/evaluations/utils/labels'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

type Props = {
  evaluations: Evaluation[]
  locale: string
}

const ALL_TYPES = 'all'

export function AdminEvaluationsScreen({ evaluations, locale }: Props) {
  const t = useTranslations('evaluations')
  const isAr = locale === 'ar'
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const filtered = useMemo(() => {
    return evaluations.filter((ev) => {
      const matchesType = typeFilter === ALL_TYPES || ev.type === typeFilter
      return matchesType
    })
  }, [evaluations, typeFilter])

  const searchFiltered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return filtered
    return filtered.filter((ev) => ev.title.toLowerCase().includes(q))
  }, [filtered, search])

  const pagination = getPaginationMeta(searchFiltered.length, page, pageSize)
  const pageData = paginateArray(searchFiltered, pagination.page, pageSize)

  return (
    <div className="space-y-4 px-4 lg:px-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('listTitle')}</h2>
        <Link href={`/${Routes.DASHBOARDS}/${Pages.ADMIN}/evaluations/create`}>
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            <span className="hidden lg:inline">{t('create')}</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="max-w-sm"
        />
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            setTypeFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={t('filterByType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>{t('allTypes')}</SelectItem>
            {(Object.keys(EVALUATION_TYPE_LABELS) as EvaluationType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {isAr ? EVALUATION_TYPE_LABELS[type].ar : EVALUATION_TYPE_LABELS[type].en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {searchFiltered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{t('empty')}</p>
      ) : (
        <DataTable
          data={pageData}
          columns={evaluationColumns}
          pagination={pagination}
          onPageChange={setPage}
          emptyMessage={t('empty')}
        />
      )}
    </div>
  )
}
