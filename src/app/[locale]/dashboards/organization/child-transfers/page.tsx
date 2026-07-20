import { ChildTransferRequestsScreen } from '@/features/children/components/ChildTransferRequestsScreen'
import { getChildTransferRequests } from '@/features/children'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ChildTransferRequestsPage({ params }: Props) {
  const { locale } = await params
  const org = await requireCurrentOrganization()
  const orgId = org.id
  const response = await getChildTransferRequests(orgId)

  return <ChildTransferRequestsScreen locale={locale} requests={response.requests} />
}
