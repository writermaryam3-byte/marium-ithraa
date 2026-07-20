import { ParentOrgChildrenScreen } from '@/features/parent/components/ParentOrgChildrenScreen'
import { ParentPrivateChildrenScreen } from '@/features/parent/components/ParentPrivateChildrenScreen'
import { getOrgChildrenServer, getPrivateChildrenServer } from '@/features/children/api'
import { getParentProfileServer } from '@/features/parent/api'
import { ErrorCard } from '@/components/shared/cards/ErrorCard'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ParentChildrenPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.parent.privateChildren' })

  try {
    const [profile, privateChildrenResult, orgChildrenResult] = await Promise.all([
      getParentProfileServer(),
      getPrivateChildrenServer(),
      getOrgChildrenServer(),
    ])

    return (
      <>
        <ParentPrivateChildrenScreen
          privateChildren={privateChildrenResult.data}
          profile={profile}
        />
        <ParentOrgChildrenScreen orgChildren={orgChildrenResult.data} />
      </>
    )
  } catch {
    return (
      <div className="app-container py-12">
        <ErrorCard message={t('loadFailed')} />
      </div>
    )
  }
}
