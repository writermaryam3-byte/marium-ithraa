import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import DashboardCards from "@/components/shared/cards/DashboardCards"
import { DataTable } from "@/components/shared/data-table/DataTable"
import { SiteHeader } from "@/components/site-header"
import { AddChildDialog, columns, getChildren } from "@/features/children"
import nextAuthOptions from "@/server/auth"
import { getServerSession } from "next-auth"
import { getTranslations } from "next-intl/server"

export default async function EmployeeChildrenPage() {
  const t = await getTranslations()
  const session = await getServerSession(nextAuthOptions)
  const userId = session?.user?.id
  if (!userId) {
    throw new Error(t("Dashboard.common.unauthorized"))
  }

  const { children } = await getChildren(userId)
  const cards = [
    {
      title: children?.length,
      description: "Dashboard.cards.childrenCount",
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
      <SiteHeader titleKey="Dashboard.titles.children" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardCards cards={cards} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6">
              <DataTable data={children} columns={columns} >
                <div className="between-center mb-4">
                  <h2 className="text-xl">{t("Dashboard.tables.childrenTitle")}</h2>
                  <AddChildDialog />
                </div>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

