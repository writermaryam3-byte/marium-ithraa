import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import DashboardCards from "@/components/shared/cards/DashboardCards"
import { DataTable } from "@/components/shared/data-table/DataTable"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { columns, getAllTests } from "@/features/tests"
import { Link } from "@/i18n/navigation"
import { Pages, Routes } from "@/lib/types/enums"
import { IconPlus } from "@tabler/icons-react"
import { getTranslations } from "next-intl/server"


export default async function AdminTestsPage() {
  const t = await getTranslations()
  const { tests } = await ((await getAllTests()))
  console.log(tests)
  return (
    <>
      <SiteHeader titleKey="Dashboard.Nav.tests" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="between-center mb-4 px-4 lg:px-6">
              <h2 className="text-xl">{t("Features.Tests.TableTitle")}</h2>
              <Link href={`/${Routes.DASHBOARDS}/${Pages.ADMIN}/${Pages.TESTS}/${Pages.NEW}`}>
                <Button variant="outline" size="sm" >
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Features.Tests.Actions.Add")}</span>
                </Button>
              </Link>
            </div>
            <div className="px-4 lg:px-6">
              <DataTable data={tests} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

