import { TeacherChildEvaluationsScreen } from '@/features/teachers/components/TeacherChildEvaluationsScreen'

type Props = {
  params: Promise<{ childId: string }>
  searchParams: Promise<{ classId?: string }>
}

export default async function TeacherChildEvaluationsPage({ params, searchParams }: Props) {
  const { childId } = await params
  const { classId } = await searchParams

  return <TeacherChildEvaluationsScreen childId={childId} classId={classId} />
}
