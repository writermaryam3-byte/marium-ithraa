"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Employee } from "../types/interfaces"
import { EmployeeRowActions } from "./employee-row-actions"
import { Link } from "@/i18n/navigation"
import { Pages, Routes } from "@/lib/types/enums"

export const columns: ColumnDef<Employee>[] = [
  {
    accessorFn: ({ user }) => user.name,
    header: "Name",
    cell: ({ row }) => (<Link
      href={`/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}/${Pages.EMPLOYEES}/${row.original.id}`}
      className="font-medium text-primary hover:underline"
    >
      {row.original.user.name}
    </Link>),
  },
  {
    accessorFn: ({ user }) => user.email,
    header: "Email",
  },
  {
    accessorFn: ({ user }) => user.phone,
    header: "Phone",
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <EmployeeRowActions employee={row.original} />,
  },
]