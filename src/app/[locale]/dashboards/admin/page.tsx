"use client"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import DashboardCards from "@/components/shared/cards/DashboardCards"
import { CardInfo } from "@/lib/types/types"
import { AlertTriangle, Book, Building, Sparkle, User, User2 } from "lucide-react"
import UsersRolesPieChart from "@/features/admin/components/users-roles-pie-chart"
import { useAdminChildren } from "@/features/children"
import { useAdminUsersInRoles } from "@/features/users"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminTests } from "@/features/tests"
import { ApiError } from "@/lib/errors/ApiError"
import { TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip"
import { columns } from "@/features/enrichers"
import { DataTable } from "@/components/shared/data-table/DataTable"

export default function AdminDashboardPage() {

  const {
    data: childrenData,
    error: childrenError,
    isError: isErrorChildren,
    isLoading: isLoadingChildren,
  } = useAdminChildren()
  const {
    data: usersInRoles,
    error: usersInRolesError,
    isError: isErrorUsersInRoles,
    isLoading: isLoadingUsersInRoles,
  } = useAdminUsersInRoles()
  const {
    data: testsData,
    error: testsError,
    isError: isErrorTests,
    isLoading: isLoadingTests,
  } = useAdminTests()

  const enrichers = usersInRoles?.enrichers || []
  const employees = usersInRoles?.employees || []
  const organizationOwners = usersInRoles?.organizationOwners || []

  const childrenErrorMessage = childrenError as ApiError
  const usersInRolesErrorMessage = usersInRolesError as ApiError
  const testsErrorMessage = testsError as ApiError

  const cards: CardInfo[] = [
    {
      title: organizationOwners.length || 0,
      description: "organization count",
      icon: <Building />,
      isLoading: isLoadingUsersInRoles,
      isErr: isErrorUsersInRoles,
      error: usersInRolesErrorMessage,
      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: employees.length || 0,
      isLoading: isLoadingUsersInRoles,
      isErr: isErrorUsersInRoles,
      description: "organization employees",
      error: usersInRolesErrorMessage,
      icon: <User />,

      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: childrenData?.children?.length || 0,
      description: "children count",
      icon: <User2 />,
      isLoading: isLoadingChildren,
      isErr: isErrorChildren,
      error: childrenErrorMessage,
      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: testsData?.tests?.length || 0,
      isLoading: isLoadingTests,
      description: "test count",
      icon: <Book />,
      isErr: isErrorTests,
      error: testsErrorMessage,
      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: enrichers.length || 0,
      description: "enrichers count",
      isLoading: isLoadingUsersInRoles,
      isErr: isErrorUsersInRoles,
      error: usersInRolesErrorMessage,
      icon: <Sparkle />,

      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },

  ]
  console.log(enrichers)
  return (
    <>
      <SiteHeader titleKey="Dashboard.titles.dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardCards cards={cards} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6 between-center">
              <h2 className="text-xl">organizations awaiting review</h2>
            </div>
            <DataTable data={enrichers} columns={columns} />
            <div className="px-4 lg:px-6">
              {isLoadingUsersInRoles ? (
                <div>
                  <Skeleton className="h-30 w-full" />

                </div>
              ) : (
                isErrorUsersInRoles ? (
                  <div className="m-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center" aria-label="Error details">
                          <AlertTriangle className="size-10" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="max-w-[320px] whitespace-pre-wrap">
                        {usersInRolesError.message}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <UsersRolesPieChart employeesNo={usersInRoles?.employees?.length || 0}
                    enrihcersNO={usersInRoles?.enrichers?.length || 0}
                    organizationOnwersNo={usersInRoles?.organizationOwners?.length || 0}
                  />
                )

              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

