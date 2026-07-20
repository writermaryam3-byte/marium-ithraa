import { NotificationsScreen } from '@/features/notifications/components/NotificationsScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function DashboardNotificationsPage({ params }: Props) {
  const { locale } = await params
  return <NotificationsScreen locale={locale} />
}
