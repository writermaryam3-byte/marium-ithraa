import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { DataTable } from "@/components/ui/data-table"
import { columns, EmployeesCards, getEmployeesByOrganization } from "@/features/employees"
import data from "../data.json"
import { Button } from "@/components/ui/button"
export default async function OrgEmployeesPage() {
    const res = await getEmployeesByOrganization("e5de0d32-285b-4d30-8497-f80a20ea52d4")
    const {count, employees} = await res.json()

    const cards = [
      {
        title: count,
        description: "Employees Count",
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
      <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <EmployeesCards cards={cards} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {/* <DataTable data={data} /> */}
              <DataTable data={employees} columns={columns}/>
            </div>
          </div>
        </div>
  </>

  )
}
