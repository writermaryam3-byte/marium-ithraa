import { SiteHeader } from '@/components/site-header'
import { AdminCreateEvaluationScreen } from '@/components/pages/dashboards/admin/AdminCreateEvaluationScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminCreateEvaluationPage({ params }: Props) {
  const { locale } = await params

  return (
    <>
      <SiteHeader titleKey="Features.Evaluations.create" />
      <div className="flex flex-1 flex-col py-4 md:py-6">
        <AdminCreateEvaluationScreen locale={locale} />
      </div>
    </>
  )
}
