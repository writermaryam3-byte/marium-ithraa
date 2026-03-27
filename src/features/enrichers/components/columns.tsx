"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Pages, Routes } from "@/lib/types/enums"
import { Enricher } from "../types/interfaces"
import { User } from "@/features/users"

function TH({ k }: { k: string }) {
  const t = useTranslations()
  // return t(k)
  return k
}

export const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: () => <TH k="enricher name" />,
    // cell: ({ row }) => (<Link
    //   href={`/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}/${Pages.EMPLOYEES}/${row.original.id}`}
    //   className="font-medium text-primary hover:underline"
    // >
    //   {row.original.user.name}
    // </Link>),
  },
  {
    id: "email",
    accessorKey: "email",
    header: () => <TH k="Dashboard.Employees.table.email" />,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: () => <TH k="Dashboard.Employees.table.phone" />,
  },
  {
    id: "approval status",
    accessorFn: ({enricher})=>enricher.approval_status,
    header: () => {
      <TH k="approval status" />
      return "approval status"
    },
  },
  {
    id: "organization name",
    accessorFn: ({enricher})=>enricher.organization_name,
    header: () => {
      <TH k="organization name" />
      return "organization name"
    },
  },
]