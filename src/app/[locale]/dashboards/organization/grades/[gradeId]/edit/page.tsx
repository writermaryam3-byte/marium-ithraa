import { notFound } from 'next/navigation'

import { GradeFormScreen } from '@/features/grades/components/GradeFormScreen'
import { type Grade } from '@/features/grades'
import { getGradeById } from '@/features/grades'
import { requireCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

type Props = {
  params: Promise<{ locale: string; gradeId: string }>
}

export default async function EditGradePage({ params }: Props) {
  const { locale, gradeId } = await params
  const org = await requireCurrentOrganization()

  let grade: Grade
  try {
    grade = (await getGradeById(gradeId)).grade
  } catch {
    notFound()
  }

  return <GradeFormScreen locale={locale} organizationId={org.id} grade={grade} />
}
