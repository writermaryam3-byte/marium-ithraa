import { SiteHeader } from '@/components/site-header'
import { AdminEvaluationsScreen } from '@/features/evaluations/components/AdminEvaluationsScreen'
import { getEvaluations } from '@/features/evaluations/api'
import type { Evaluation } from '@/features/evaluations/types'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminEvaluationsPage({ params }: Props) {
  const { locale } = await params
  let evaluations: Evaluation[] = []

  try {
    const data = await getEvaluations()
    evaluations = Array.isArray(data) ? data : []
  } catch {
    evaluations = []
  }

  return (
    <>
      <SiteHeader titleKey="evaluations.listTitle" />
      <div className="flex flex-1 flex-col py-4 md:py-6">
        <AdminEvaluationsScreen evaluations={evaluations} locale={locale} />
      </div>
    </>
  )
}
