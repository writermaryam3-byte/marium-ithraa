import { AdminDashboardScreen } from '@/components/pages/dashboards/admin/AdminDashboardScreen'
import { DashboardTopBar } from '@/components/shared/dashboard/DashboardTopBar'

export default function AdminDashboardPage() {
  return (
    <>
      <DashboardTopBar />
      <AdminDashboardScreen />
    </>
  )
}
