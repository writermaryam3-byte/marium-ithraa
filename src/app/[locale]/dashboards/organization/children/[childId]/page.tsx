import { notFound } from 'next/navigation'

import { ChildFormScreen } from '@/components/pages/dashboards/organization/ChildFormScreen'
import { getChildById } from '@/features/children'
import { getClassesByOrg } from '@/features/classes'
import { getGradesByOrg } from '@/features/grades'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string; childId: string }>
}

export default async function EditChildPage({ params }: Props) {
  const { locale, childId } = await params
  const org = await requireCurrentOrganization()
  const orgId = org.id

  let child
  let gradesRes
  let classesRes
  try {
    ;[child, gradesRes, classesRes] = await Promise.all([
      getChildById(childId).then((r) => r.child),
      getGradesByOrg(orgId),
      getClassesByOrg(orgId),
    ])
  } catch {
    notFound()
  }

  return (
    <ChildFormScreen
      locale={locale}
      organizationId={orgId}
      grades={gradesRes.grades}
      classes={classesRes.classes}
      child={child}
    />
  )
}
