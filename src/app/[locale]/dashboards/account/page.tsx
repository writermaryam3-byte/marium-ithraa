import { AccountSettingsScreen } from '@/features/account/components/AccountSettingsScreen'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AccountSettingsPage({ params }: Props) {
  const { locale } = await params
  return <AccountSettingsScreen locale={locale} />
}
