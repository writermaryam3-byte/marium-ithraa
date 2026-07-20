import { notFound } from 'next/navigation'

import { ClassDetailScreen } from '@/features/classes/components/ClassDetailScreen'
import { type ClassItem } from '@/features/classes'
import { getClassById } from '@/features/classes'

type Props = {
  params: Promise<{ locale: string; classId: string }>
}

export default async function ClassDetailPage({ params }: Props) {
  const { classId } = await params

  let classItem: ClassItem
  try {
    const { class: fetched } = await getClassById(classId)
    classItem = fetched
  } catch {
    notFound()
  }

  return (
    <ClassDetailScreen classItem={classItem} classChildren={classItem.children ?? []} />
  )
}
