import { getTranslations } from 'next-intl/server'

import { getClassesByTeacher } from '@/features/classes/api'
import { getCurrentTeacher } from '@/lib/helpers/getCurrentTeacher'
import { TeacherClassesScreen } from '@/features/teachers/components/TeacherClassesScreen'

export default async function TeacherClassesPage() {
  const t = await getTranslations('teachers.dashboard')
  const teacher = await getCurrentTeacher()

  if (!teacher?.teacherId) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">{t('classes')}</h1>
        <p className="mt-2 text-muted-foreground">{t('profileNotFound')}</p>
      </main>
    )
  }

  let classes: Awaited<ReturnType<typeof getClassesByTeacher>>['classes'] = []
  try {
    const res = await getClassesByTeacher(teacher.teacherId)
    classes = res.classes ?? []
  } catch {
    classes =
      teacher.classes?.map((name, index) => ({
        id: String(index),
        name,
        gradeId: '',
      })) ?? []
  }

  return <TeacherClassesScreen classes={classes} teacherName={teacher.name} />
}
