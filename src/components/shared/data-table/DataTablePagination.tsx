'use client'

import { Button } from '@/components/ui/button'
import type { PaginatedMeta } from '@/lib/api/pagination'

type Props = {
  meta: PaginatedMeta
  onPageChange: (page: number) => void
  labels?: {
    previous?: string
    next?: string
    page?: string
  }
}

export function DataTablePagination({ meta, onPageChange, labels }: Props) {
  const previous = labels?.previous ?? 'Previous'
  const next = labels?.next ?? 'Next'
  const pageLabel = labels?.page ?? 'Page'

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-4">
      <p className="text-sm text-muted-foreground">
        {pageLabel} {meta.page} / {meta.totalPages} · {meta.total} items
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          {previous}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          {next}
        </Button>
      </div>
    </div>
  )
}
