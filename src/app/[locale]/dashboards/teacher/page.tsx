import { TeacherDashboardScreen } from '@/components/pages/dashboards/teacher/TeacherDashboardScreen'
import { getClassesByTeacher } from '@/features/classes/api'
import { getCurrentTeacher } from '@/lib/helpers/getCurrentTeacher'

export default async function TeacherDashboardPage() {
  const teacher = await getCurrentTeacher()
  let classCount = teacher?.classes?.length ?? 0

  if (teacher?.teacherId) {
    try {
      const { classes } = await getClassesByTeacher(teacher.teacherId)
      classCount = classes?.length ?? classCount
    } catch {
      // fallback to profile class names
    }
  }

  return <TeacherDashboardScreen classCount={classCount} teacherName={teacher?.name} />
}
