'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { DataTable } from '@/components/shared/data-table/DataTable'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { attemptColumns } from '@/features/evaluations/components/attempt-columns'
import { useAttempts } from '@/features/evaluations/hooks'
import type { EvaluationAttempt } from '@/features/evaluations/types'

type Props = { locale: string }

const ALL = 'all'

export function AdminAttemptsScreen({ locale }: Props) {
  const t = useTranslations('evaluations')
  const isAr = locale === 'ar'
  const [status, setStatus] = useState(ALL)
  const [evaluationId, setEvaluationId] = useState('')
  const [orgChildId, setOrgChildId] = useState('')
  const [privChildId, setPrivChildId] = useState('')

  const filters = useMemo(
    () => ({
      status: status === ALL ? undefined : status,
      evaluationId: evaluationId || undefined,
      organizationChildId: orgChildId || undefined,
      privateChildId: privChildId || undefined,
    }),
    [status, evaluationId, orgChildId, privChildId],
  )

  const { data, isLoading, isError, refetch } = useAttempts(filters)
  const attempts: EvaluationAttempt[] = Array.isArray(data) ? data : []

  return (
    <div className="space-y-4 px-4 lg:px-6" dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-xl font-semibold">{t('attemptsTitle')}</h2>

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('allStatuses')}</SelectItem>
            <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
            <SelectItem value="submitted">{t('submitted')}</SelectItem>
            <SelectItem value="approved">{t('approved')}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={t('evaluationIdFilter')}
          value={evaluationId}
          onChange={(e) => setEvaluationId(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Org child ID"
          value={orgChildId}
          onChange={(e) => setOrgChildId(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Private child ID"
          value={privChildId}
          onChange={(e) => setPrivChildId(e.target.value)}
          className="max-w-xs"
        />
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
        <p className="text-sm text-muted-foreground py-8 text-center">{t('empty')}</p>
      ) : (
        <DataTable data={attempts} columns={attemptColumns} />
      )}
    </div>
  )
}
