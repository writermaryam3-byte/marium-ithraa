import { TeachersScreen } from '@/features/teachers/components/TeachersScreen'
import { getTeachersByOrg } from '@/features/teachers'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TeachersPage({ params }: Props) {
  const { locale } = await params
  const org = await requireCurrentOrganization()
  const teachers = await getTeachersByOrg(org.id)
  return <TeachersScreen teachers={teachers.teachers} />
}
