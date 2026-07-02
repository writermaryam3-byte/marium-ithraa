'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'
import type { EvaluationAttempt } from '../types'
import { getAttemptStatusLabel } from '../utils/labels'

const ADMIN_ATTEMPTS = `/${Routes.DASHBOARDS}/${Pages.ADMIN}/attempts`

function TH({ messageKey }: { messageKey: string }) {
  const t = useTranslations('Features.Evaluations')
  return t(messageKey)
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('Features.Evaluations')
  const label = getAttemptStatusLabel(status, t)
  const variant =
    status === 'approved' ? 'default' : status === 'submitted' ? 'secondary' : 'outline'
  return <Badge variant={variant}>{label}</Badge>
}

function AttemptViewLink({ attemptId }: { attemptId: string }) {
  const t = useTranslations('Features.Evaluations')
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
    cell: ({ row }) => row.original.child?.name ?? '—',
  },
  {
    id: 'parent',
    header: () => <TH messageKey="parent" />,
    cell: ({ row }) => {
      const p = row.original.parent as { name?: string; email?: string } | undefined
      return p?.name ?? p?.email ?? '—'
    },
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
