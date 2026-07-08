import { getTranslations } from 'next-intl/server'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SiteHeader } from '@/components/site-header'
import DashboardCards from '@/components/shared/cards/DashboardCards'
import { CardInfo } from '@/lib/types/types'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { getAllUsers } from '@/features/users/api'
import { columns } from '@/features/users'

export default async function AdminDashboardPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'dashboard.adminUsers' })

  const users = await getAllUsers()
  const cards: CardInfo[] = [
    {
      badage: {
        exist: false,
      },
      footer: {
        exist: false,
      },
      description: t('usersCount'),
      title: users.users.length || 0,
    },
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
            <div className="px-4 lg:px-6 between-center">
              <h2 className="text-xl">{t('usersTable')}</h2>
            </div>
            <DataTable data={users.users} columns={columns} />
          </div>
        </div>
      </div>
    </>
  )
}
