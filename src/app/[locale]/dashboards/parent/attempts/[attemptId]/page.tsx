'use client'

import { useParams } from 'next/navigation'

import { EvaluationAttemptPageContent } from '@/features/evaluations/components/EvaluationAttemptPageContent'

export default function ParentAttemptPage() {
  const params = useParams<{ attemptId: string }>()
  return <EvaluationAttemptPageContent attemptId={params.attemptId} />
}
