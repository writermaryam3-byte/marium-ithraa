'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { LookupOption, LookupResult } from '@/features/admin-lookup/types'

type EntityComboboxProps = {
  value?: string
  onValueChange: (value: string | undefined, option?: LookupOption) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
  loadingLabel?: string
  errorLabel?: string
  ariaLabel?: string
  disabled?: boolean
  clearable?: boolean
  selectedOption?: LookupOption | null
  fetchOptions: (params: { search: string; page: number }) => Promise<LookupResult>
}

export function EntityCombobox({
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  loadingLabel,
  errorLabel,
  ariaLabel,
  disabled,
  clearable = true,
  selectedOption,
  fetchOptions,
}: EntityComboboxProps) {
  const t = useTranslations('common.entityCombobox')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [options, setOptions] = useState<LookupOption[]>([])
  const [meta, setMeta] = useState<LookupResult['meta'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [resolvedOption, setResolvedOption] = useState<LookupOption | null>(selectedOption ?? null)

  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    if (selectedOption) {
      setResolvedOption(selectedOption)
    }
  }, [selectedOption])

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setLoading(true)
    setError(false)

    void fetchOptions({ search: debouncedSearch, page })
      .then((result) => {
        if (cancelled) return
        setOptions(result.items)
        setMeta(result.meta)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setOptions([])
        setMeta(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, debouncedSearch, page, fetchOptions])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const displayLabel = useMemo(() => {
    if (resolvedOption && resolvedOption.id === value) return resolvedOption.label
    return placeholder ?? t('placeholder')
  }, [resolvedOption, value, placeholder, t])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel ?? t('ariaLabel')}
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-between rounded-xl font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="ms-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-2rem,24rem)] p-0" align="start">
        <div className="border-b p-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder ?? t('searchPlaceholder')}
            className="h-9 rounded-lg"
            aria-label={searchPlaceholder ?? t('searchPlaceholder')}
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {loadingLabel ?? t('loading')}
            </div>
          ) : error ? (
            <p className="px-3 py-6 text-sm text-destructive">{errorLabel ?? t('error')}</p>
          ) : options.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted-foreground">{emptyLabel ?? t('empty')}</p>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-accent',
                  value === option.id && 'bg-accent',
                )}
                onClick={() => {
                  setResolvedOption(option)
                  onValueChange(option.id, option)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn('mt-0.5 size-4 shrink-0', value === option.id ? 'opacity-100' : 'opacity-0')}
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{option.label}</span>
                  {option.description ? (
                    <span className="block truncate text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </button>
            ))
          )}
        </div>
        {meta && meta.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t px-2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!meta.hasPreviousPage || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t('previous')}
            </Button>
            <span className="text-xs text-muted-foreground">
              {meta.page} / {meta.totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!meta.hasNextPage || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('next')}
            </Button>
          </div>
        ) : null}
        {clearable && value ? (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => {
                setResolvedOption(null)
                onValueChange(undefined)
              }}
            >
              <X className="size-4" />
              {t('clear')}
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
