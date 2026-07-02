import { SiteHeader } from '@/components/site-header'
import { AdminAttemptsScreen } from '@/components/pages/dashboards/admin/AdminAttemptsScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminAttemptsPage({ params }: Props) {
  const { locale } = await params

  return (
    <>
      <SiteHeader titleKey="Features.Evaluations.attemptsTitle" />
      <div className="flex flex-1 flex-col py-4 md:py-6">
        <AdminAttemptsScreen locale={locale} />
      </div>
    </>
  )
}
