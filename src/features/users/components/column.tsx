'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'
import { IUserResponseDto } from '../types'

function TH({ k }: { k: string }) {
  const t = useTranslations()
  return t(k)
}

export const columns: ColumnDef<IUserResponseDto>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <TH k="users.fields.name" />,
    cell: ({ row }) => (
      <Link
        href={`/${Routes.DASHBOARDS}/${Pages.ADMIN}/${Pages.USERS}/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <TH k="users.fields.email" />,
  },
  {
    id: 'isEmailVerfied',
    accessorKey: 'isEmailVerified',
    header: () => <TH k="users.fields.isEmailVerified" />,
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: () => <TH k="users.fields.phone" />,
  },
  {
    id: 'isPhoneVerfied',
    accessorKey: 'isPhoneVerified',
    header: () => <TH k="users.fields.isPhoneVerified" />,
  },
  {
    id: 'roles',
    accessorKey: 'role',
    header: () => <TH k="users.fields.role" />,
    cell({ row }) {
      return row.original.roles.map((r) => r.name).join('-')
    },
  },
]
