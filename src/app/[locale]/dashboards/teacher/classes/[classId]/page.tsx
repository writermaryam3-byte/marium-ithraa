import { notFound } from 'next/navigation'

import { getClassById } from '@/features/classes/api'
import { TeacherClassDetailScreen } from '@/features/teachers/components/TeacherClassDetailScreen'
import { getCurrentTeacher } from '@/lib/helpers/getCurrentTeacher'

type Props = {
  params: Promise<{ classId: string }>
}

export default async function TeacherClassDetailPage({ params }: Props) {
  const { classId } = await params
  const teacher = await getCurrentTeacher()

  if (!teacher?.teacherId) {
    notFound()
  }

  try {
    const { class: classItem } = await getClassById(classId)
    const isAssigned = classItem.teacherId === teacher.teacherId

    if (!isAssigned) {
      notFound()
    }

    return (
      <TeacherClassDetailScreen
        classItem={classItem}
        classChildren={classItem.children ?? []}
      />
    )
  } catch {
    notFound()
  }
}
