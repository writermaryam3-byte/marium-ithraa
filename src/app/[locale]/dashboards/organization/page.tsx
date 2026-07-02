import { OrganizationStatusScreen } from '@/features/organizations'
import { getCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'
import { ApprovalStatus } from '@/lib/types/enums'
import { OrganizationDashboardScreen } from '@/components/pages/dashboards/OrganizationDashboardScreen'
import type { ActivityItem } from '@/components/shared/dashboard/ActivityFeed'
import type { StatCardProps } from '@/components/shared/dashboard/StatCard'
type Props = {
  params: Promise<{ locale: string }>
}

export default async function OrganizationDashboardPage({ params }: Props) {
  const { locale } = await params
  const org = await getCurrentOrganization()

  if (!org) {
    return null
  }

  if (org.approvalStatus !== ApprovalStatus.APPROVED) {
    return <OrganizationStatusScreen organization={org} locale={locale} />
  }

  const organizationName = org.organizationName

  const stats: StatCardProps[] = []
  const activities: ActivityItem[] = []

  return (
    <OrganizationDashboardScreen
      locale={locale}
      organizationName={organizationName}
      stats={stats}
      activities={activities}
    />
  )
}
