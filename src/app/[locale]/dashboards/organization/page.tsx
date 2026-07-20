import { OrganizationStatusScreen } from '@/features/organizations'
import { getCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'
import { ApprovalStatus } from '@/lib/types/enums'
import { OrganizationDashboardScreen } from '@/features/organizations/components/OrganizationDashboardScreen'

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

  return <OrganizationDashboardScreen organizationName={org.organizationName} />
}
