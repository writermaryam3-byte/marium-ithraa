import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import DashboardCards from "@/components/shared/cards/DashboardCards"
import { DataTable } from "@/components/shared/data-table/DataTable"
import { SiteHeader } from "@/components/site-header"
import { AddEmployeeDialog, columns, getEmployeesByOrganization } from "@/features/employees"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"
import { CardInfo } from "@/lib/types/types"
export default async function OrgEmployeesPage() {
  const organizationOwner = (await getCurrentOrganization())
  const orgId = organizationOwner.user.organization.id
  const { employees } = await getEmployeesByOrganization(orgId)

  const cards: CardInfo[] = [
    {
      title: employees?.length || 0,
      description: "Dashboard.cards.employeesCount",
      footer: {
        exist: false
      },
      badage: {
        exist: false
      },


    }
  ]
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
            <div className="between-center px-4 lg:px-6">
              <h2 className="text-xl">Employees Table</h2>
              <AddEmployeeDialog organizationId={orgId} />
            </div>
            <DataTable data={employees} columns={columns} />
          </div>
        </div>
      </div>
    </>

  )
}
