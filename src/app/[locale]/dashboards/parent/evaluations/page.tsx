import { redirect } from '@/i18n/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ParentEvaluationsPage({ params }: Props) {
  const { locale } = await params
  redirect({ href: '/dashboards/parent/children', locale })
}
