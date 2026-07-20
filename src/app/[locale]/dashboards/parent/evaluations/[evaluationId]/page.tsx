'use client'

import { useParams } from 'next/navigation'
import EvaluationBuilder from '@/features/evaluations/components/EvaluationBuilder'

export default function ParentEvaluationPage() {
  const params = useParams<{ evaluationId: string }>()
  return <EvaluationBuilder evaluationId={params.evaluationId} />
}
