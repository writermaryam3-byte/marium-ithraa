'use client'

import { Button } from '@/components/ui/button'
import type { PaginationMeta } from '@/lib/types/interfaces'
import { useTranslations } from 'next-intl'

type Props = {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  labels?: {
    previous?: string
    next?: string
    page?: string
  }
}

export function DataTablePagination({ meta, onPageChange, labels }: Props) {
  const t = useTranslations('pagination')
  const previous = labels?.previous ?? t('previous')
  const next = labels?.next ?? t('next')
  const pageLabel = labels?.page ?? t('page')

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-4">
      <p className="text-sm text-muted-foreground">
        {pageLabel} {meta.page} / {meta.totalPages} · {meta.total} {t('items')}
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
