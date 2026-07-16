import { ParentOrgChildrenScreen } from '@/features/parent/components/ParentOrgChildrenScreen'
import { ParentPrivateChildrenScreen } from '@/features/parent/components/ParentPrivateChildrenScreen'
import { getOrgChildrenServer, getPrivateChildrenServer } from '@/features/children/api'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ParentChildrenPage({ params }: Props) {
  await params
  const { data: privateChildren } = await getPrivateChildrenServer()
  const { data: orgChildren } = await getOrgChildrenServer()
  return (
    <>
      <ParentPrivateChildrenScreen privateChildren={privateChildren} />
      <ParentOrgChildrenScreen orgChildren={orgChildren} />
    </>
  )
}
