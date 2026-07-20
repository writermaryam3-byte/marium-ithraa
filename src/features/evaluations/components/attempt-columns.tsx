'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'
import type { EvaluationAttempt } from '../types'
import { getAttemptChildName, getAttemptParentLabel } from '../utils/attempt-display'
import { getAttemptStatusLabel } from '../utils/labels'

const ADMIN_ATTEMPTS = `/${Routes.DASHBOARDS}/${Pages.ADMIN}/attempts`

function TH({ messageKey }: { messageKey: string }) {
  const t = useTranslations('evaluations')
  return t(messageKey)
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('evaluations')
  const label = getAttemptStatusLabel(status, t)
  const variant =
    status === 'approved' ? 'default' : status === 'submitted' ? 'secondary' : 'outline'
  return <Badge variant={variant}>{label}</Badge>
}

function AttemptViewLink({ attemptId }: { attemptId: string }) {
  const t = useTranslations('evaluations')
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`${ADMIN_ATTEMPTS}/${attemptId}`}>{t('viewDetails')}</Link>
    </Button>
  )
}

export const attemptColumns: ColumnDef<EvaluationAttempt>[] = [
  {
    id: 'child',
    header: () => <TH messageKey="child" />,
    cell: ({ row }) => getAttemptChildName(row.original) ?? '—',
  },
  {
    id: 'parent',
    header: () => <TH messageKey="parent" />,
    cell: ({ row }) => getAttemptParentLabel(row.original) ?? '—',
  },
  {
    id: 'evaluation',
    header: () => <TH messageKey="evaluation" />,
    cell: ({ row }) => row.original.evaluation?.title ?? '—',
  },
  {
    id: 'attemptNumber',
    accessorKey: 'attemptNumber',
    header: () => <TH messageKey="attemptNumber" />,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <TH messageKey="status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'score',
    accessorKey: 'score',
    header: () => <TH messageKey="score" />,
    cell: ({ row }) => row.original.score ?? '—',
  },
  {
    id: 'submittedAt',
    accessorKey: 'submittedAt',
    header: () => <TH messageKey="submittedAt" />,
    cell: ({ row }) =>
      row.original.submittedAt ? new Date(row.original.submittedAt).toLocaleString() : '—',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <AttemptViewLink attemptId={row.original.id} />,
  },
]
