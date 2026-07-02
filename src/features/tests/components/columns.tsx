'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { Test } from '../types/interfaces'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

function TH({ k }: { k: string }) {
  const t = useTranslations()
  return t(k)
}

export const columns: ColumnDef<Test>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <TH k="Features.Tests.title" />,
    cell: ({ row }) => (
      <Link
        href={`/${Routes.DASHBOARDS}/${Pages.ADMIN}/${Pages.TESTS}/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    id: 'questionNo',
    accessorKey: 'questionNo',
    header: () => <TH k="Features.Tests.questionCount" />,
  },
  // {
  //   id: "assignments",
  //   accessorFn: ({ assignments }) => assignments.length,
  //   header: () => <TH k="Features.Tests.assignmentCount" />,
  // },
  // {
  //   id: "actions",
  //   header: "",
  //   cell: ({ row }) => <EmployeeRowActions employee={row.original} />,
  // },
]
