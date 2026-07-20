'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'
import type { Evaluation } from '../types'
import { formatAgeRange, getEvaluationTypeLabel } from '../utils/labels'

const ADMIN_EVALUATIONS = `/${Routes.DASHBOARDS}/${Pages.ADMIN}/evaluations`

function TH({ messageKey }: { messageKey: string }) {
  const t = useTranslations('evaluations')
  return t(messageKey)
}

function TypeBadge({ type }: { type: Evaluation['type'] }) {
  const t = useTranslations('evaluations')
  return (
    <Badge variant="secondary" className="font-normal">
      {getEvaluationTypeLabel(type, t)}
    </Badge>
  )
}

function AgeRangeCell({ evaluation }: { evaluation: Evaluation }) {
  const t = useTranslations('evaluations')
  return formatAgeRange(evaluation.ageFrom, evaluation.ageTo, t)
}

function ViewDetailsLink({ id }: { id: string }) {
  const t = useTranslations('evaluations')
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`${ADMIN_EVALUATIONS}/${id}`}>{t('viewDetails')}</Link>
    </Button>
  )
}

function ArchivedBadge({ archived }: { archived?: boolean }) {
  const t = useTranslations('evaluations')
  if (!archived) return null
  return (
    <Badge variant="outline" className="ms-2">
      {t('archivedBadge')}
    </Badge>
  )
}

export const evaluationColumns: ColumnDef<Evaluation>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <TH messageKey="title" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center">
        <Link
          href={`${ADMIN_EVALUATIONS}/${row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.title}
        </Link>
        <ArchivedBadge archived={row.original.isArchived} />
      </span>
    ),
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: () => <TH messageKey="type" />,
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
  },
  {
    id: 'ageRange',
    header: () => <TH messageKey="ageRange" />,
    cell: ({ row }) => <AgeRangeCell evaluation={row.original} />,
  },
  {
    id: 'evaluatorTypes',
    header: () => <TH messageKey="evaluatorTypes" />,
    cell: ({ row }) =>
      row.original.evaluatorTypes?.length ? row.original.evaluatorTypes.join(', ') : '—',
  },
  {
    id: 'dimensionsCount',
    header: () => <TH messageKey="dimensions" />,
    cell: ({ row }) => row.original.dimensions?.length ?? '—',
  },
  {
    id: 'questionsCount',
    header: () => <TH messageKey="questions" />,
    cell: ({ row }) => row.original.questions?.length ?? '—',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <ViewDetailsLink id={row.original.id} />,
  },
]
