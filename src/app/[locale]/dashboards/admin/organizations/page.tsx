import { AdminOrganizationsScreen } from '@/features/organizations'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminOrganizationsPage({ params }: Props) {
  const { locale } = await params
  return <AdminOrganizationsScreen locale={locale} />
}
