import { TeacherFormScreen } from '@/features/teachers/components/TeacherFormScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewTeacherPage({ params }: Props) {
  const { locale } = await params
  return <TeacherFormScreen locale={locale} />
}
