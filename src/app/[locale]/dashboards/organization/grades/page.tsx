import { GradesScreen } from '@/features/grades/components/GradesScreen'
import { getGradesByOrg } from '@/features/grades'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function GradesPage({ params }: Props) {
  await params
  const org = await requireCurrentOrganization()
  const { grades } = await getGradesByOrg(org.id)
  return <GradesScreen grades={grades} />
}
