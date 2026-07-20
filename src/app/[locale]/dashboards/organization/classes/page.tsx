import { ClassesScreenClient } from '@/features/classes/components/ClassesScreenClient'
import { getClassesByOrg } from '@/features/classes'
import { getGradesByOrg } from '@/features/grades'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ClassesPage({ params }: Props) {
  await params
  const org = await requireCurrentOrganization()
  const orgId = org.id

  const [classesRes, gradesRes] = await Promise.all([getClassesByOrg(orgId), getGradesByOrg(orgId)])

  return <ClassesScreenClient classes={classesRes.classes} grades={gradesRes.grades} />
}
