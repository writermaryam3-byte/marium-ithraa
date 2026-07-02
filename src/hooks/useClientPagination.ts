'use client'

import { useMemo, useState } from 'react'

import { getPaginationMeta, paginateArray } from '@/lib/api/pagination'

export function useClientPagination<T>(items: T[], pageSize = 12) {
  const [page, setPage] = useState(1)

  const pagination = useMemo(
    () => getPaginationMeta(items.length, page, pageSize),
    [items.length, page, pageSize],
  )

  const pageItems = useMemo(
    () => paginateArray(items, pagination.page, pageSize),
    [items, pagination.page, pageSize],
  )

  const setPageSafe = (next: number) => {
    setPage(next)
  }

  const resetPage = () => setPage(1)

  return {
    page,
    setPage: setPageSafe,
    resetPage,
    pagination,
    pageItems,
  }
}
