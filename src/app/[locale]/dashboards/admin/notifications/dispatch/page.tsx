import { DashboardTopBar } from '@/components/shared/dashboard/DashboardTopBar'
import { AdminDispatchNotificationScreen } from '@/components/pages/dashboards/admin/AdminDispatchNotificationScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminDispatchNotificationPage({ params }: Props) {
  const { locale } = await params

  return (
    <>
      <DashboardTopBar />
      <AdminDispatchNotificationScreen locale={locale} />
    </>
  )
}
