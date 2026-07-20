import { ParentChildEvaluationsScreen } from '@/features/parent/components/ParentChildEvaluationsScreen'

type Props = {
  params: Promise<{ locale: string; childId: string }>
}

export default async function ParentChildEvaluationsPage({ params }: Props) {
  const { childId } = await params

  return (
    <div className="app-container py-6">
      <ParentChildEvaluationsScreen childId={childId} />
    </div>
  )
}
