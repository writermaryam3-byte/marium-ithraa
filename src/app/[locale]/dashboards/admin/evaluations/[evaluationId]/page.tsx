import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/site-header'
import { AdminEvaluationDetailsScreen } from '@/features/evaluations/components/AdminEvaluationDetailsScreen'
import { getEvaluationDetails } from '@/features/evaluations/api'

type Props = {
  params: Promise<{ locale: string; evaluationId: string }>
}

export default async function AdminEvaluationDetailsPage({ params }: Props) {
  const { evaluationId } = await params

  let evaluation
  try {
    evaluation = await getEvaluationDetails(evaluationId)
  } catch {
    notFound()
  }

  if (!evaluation?.id) notFound()

  return (
    <>
      <SiteHeader titleKey="Features.Evaluations.detailsTitle" />
      <div className="flex flex-1 flex-col py-4 md:py-6">
        <AdminEvaluationDetailsScreen evaluation={evaluation} />
      </div>
    </>
  )
}
