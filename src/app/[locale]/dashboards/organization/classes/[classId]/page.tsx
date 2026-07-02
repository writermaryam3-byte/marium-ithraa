import { notFound } from 'next/navigation'

import { ClassDetailScreen } from '@/components/pages/dashboards/organization/ClassDetailScreen'
import { getAllChildrenByOrg } from '@/features/children'
import { type Child } from '@/features/children/types/interfaces'
import { type ClassItem } from '@/features/classes'
import { getClassById } from '@/features/classes'

type Props = {
  params: Promise<{ locale: string; classId: string }>
}

export default async function ClassDetailPage({ params }: Props) {
  const { classId } = await params

  let classItem: ClassItem
  let children: Child[]
  try {
    const { class: fetched } = await getClassById(classId)
    classItem = fetched
    const orgId = classItem.organizationId
    children = orgId
      ? (await getAllChildrenByOrg(orgId)).children.filter(
          (c) => (c.classId ?? c.class?.id) === classId,
        )
      : (classItem.children ?? [])
  } catch {
    notFound()
  }

  return <ClassDetailScreen classItem={classItem} classChildren={children} />
}
