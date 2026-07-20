'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { Employee } from '../types/interfaces'
import { EmployeeRowActions } from './employee-row-actions'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

function TH({ k }: { k: string }) {
  const t = useTranslations()
  return t(k)
}

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'name',
    accessorFn: ({ user }) => user.name,
    header: () => <TH k="employees.table.name" />,
    cell: ({ row }) => (
      <Link
        href={`/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}/${Pages.EMPLOYEES}/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    id: 'email',
    accessorFn: ({ user }) => user.email,
    header: () => <TH k="employees.table.email" />,
  },
  {
    id: 'phone',
    accessorFn: ({ user }) => user.phone,
    header: () => <TH k="employees.table.phone" />,
  },
  {
    id: 'job title',
    accessorKey: 'job_title',
    header: () => <TH k="employees.table.jobTitle" />,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <EmployeeRowActions employee={row.original} />,
  },
]
