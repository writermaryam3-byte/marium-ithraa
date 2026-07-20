import { notFound } from 'next/navigation'

import { ClassFormScreen } from '@/features/classes/components/ClassFormScreen'
import { type ClassItem } from '@/features/classes'
import { getClassById } from '@/features/classes'
import { getGradesByOrg } from '@/features/grades'
import { getTeachersByOrg } from '@/features/teachers/api'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string; classId: string }>
}

export default async function EditClassPage({ params }: Props) {
  const { locale, classId } = await params
  const org = await requireCurrentOrganization()
  const orgId = org.id

  let classItem: ClassItem
  let gradesRes
  let teachersRes
  try {
    ;[classItem, gradesRes, teachersRes] = await Promise.all([
      getClassById(classId).then((r) => r.class),
      getGradesByOrg(orgId),
      getTeachersByOrg(orgId),
    ])
  } catch {
    notFound()
  }

  return (
    <ClassFormScreen
      locale={locale}
      organizationId={orgId}
      grades={gradesRes.grades}
      teachers={teachersRes.teachers}
      classItem={classItem}
    />
  )
}
