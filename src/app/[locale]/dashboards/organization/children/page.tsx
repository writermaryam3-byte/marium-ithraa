import { ChildrenScreen } from '@/components/pages/dashboards/organization/ChildrenScreen'
import { getAllChildrenByOrg } from '@/features/children'
import { getClassesByOrg } from '@/features/classes'
import { getGradesByOrg } from '@/features/grades'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ChildrenPage({ params }: Props) {
  await params
  const org = await requireCurrentOrganization()
  const orgId = org.id

  const [childrenRes, gradesRes, classesRes] = await Promise.all([
    getAllChildrenByOrg(orgId),
    getGradesByOrg(orgId),
    getClassesByOrg(orgId),
  ])

  return (
    <ChildrenScreen
      childrens={childrenRes.children}
      grades={gradesRes.grades}
      classes={classesRes.classes}
    />
  )
}
