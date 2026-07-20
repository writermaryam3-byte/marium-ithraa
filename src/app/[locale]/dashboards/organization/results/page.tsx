import { OwnerEvaluationResultsScreen } from '@/features/evaluations/components/OwnerEvaluationResultsScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ResultsPage({ params }: Props) {
  const { locale } = await params
  return <OwnerEvaluationResultsScreen locale={locale} />
}
