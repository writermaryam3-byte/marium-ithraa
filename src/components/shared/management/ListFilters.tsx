'use client'

import { useTranslations } from 'next-intl'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FilterOption = { value: string; label: string }

type ListFiltersProps = {
  locale: string
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  gradeFilter?: {
    value: string
    onChange: (value: string) => void
    options: FilterOption[]
    label: string
    allLabel: string
  }
  classFilter?: {
    value: string
    onChange: (value: string) => void
    options: FilterOption[]
    label: string
    allLabel: string
  }
}

export function ListFilters({
  locale,
  search,
  onSearchChange,
  searchPlaceholder,
  gradeFilter,
  classFilter,
}: ListFiltersProps) {
  const t = useTranslations('common')

  return (
    <div
      className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4"
      dir={getTextDirection(locale)}
    >
      <div className="flex-1">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder ?? t('general.search')}
          className="rounded-xl"
        />
      </div>

      {gradeFilter && (
        <div className="w-full md:w-48">
          <Select
            value={gradeFilter.value || 'all'}
            onValueChange={(v) => gradeFilter.onChange(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="rounded-xl w-full">
              <SelectValue placeholder={gradeFilter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{gradeFilter.allLabel}</SelectItem>
              {gradeFilter.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {classFilter && (
        <div className="w-full md:w-48">
          <Select
            value={classFilter.value || 'all'}
            onValueChange={(v) => classFilter.onChange(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="rounded-xl w-full">
              <SelectValue placeholder={classFilter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{classFilter.allLabel}</SelectItem>
              {classFilter.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
