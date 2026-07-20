'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { type Child } from '../types/interfaces'
import { ChildRowActions } from './child-row-actions'

function TH({ k }: { k: string }) {
  const t = useTranslations()
  return t(k)
}

export const columns: ColumnDef<Child>[] = [
  {
    accessorKey: 'name',
    header: () => <TH k="children.table.name" />,
  },
  {
    id: 'grade',
    header: () => <TH k="children.table.grade" />,
    cell: ({ row }) => {
      const grade = row.original.grade
      if (typeof grade === 'object' && grade?.name) return grade.name
      if (typeof grade === 'string') return grade
      return row.original.gradeName ?? '—'
    },
  },
  {
    accessorKey: 'gender',
    header: () => <TH k="children.table.gender" />,
  },
  {
    accessorKey: 'birthDate',
    header: () => <TH k="children.table.birthDate" />,
    cell: ({ row }) => {
      const value = row.original.birthDate
      // Handles ISO strings; falls back to raw value.
      const date = value ? new Date(value) : null
      return (
        <span>{date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : value}</span>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <ChildRowActions child={row.original} />,
  },
]

export const adminColumns: ColumnDef<Child>[] = [
  {
    accessorKey: 'name',
    header: () => <TH k="children.table.name" />,
  },
  {
    id: 'grade',
    header: () => <TH k="children.table.grade" />,
    cell: ({ row }) => {
      const grade = row.original.grade
      if (typeof grade === 'object' && grade?.name) return grade.name
      if (typeof grade === 'string') return grade
      return row.original.gradeName ?? '—'
    },
  },
  {
    accessorKey: 'gender',
    header: () => <TH k="children.table.gender" />,
  },
  {
    accessorKey: 'birthDate',
    header: () => <TH k="children.table.birthDate" />,
    cell: ({ row }) => {
      const value = row.original.birthDate
      // Handles ISO strings; falls back to raw value.
      const date = value ? new Date(value) : null
      return (
        <span>{date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : value}</span>
      )
    },
  },
]
