import { GradeFormScreen } from '@/components/pages/dashboards/organization/GradeFormScreen'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewGradePage({ params }: Props) {
  const { locale } = await params
  const org = await requireCurrentOrganization()
  return <GradeFormScreen locale={locale} organizationId={org.id} />
}
