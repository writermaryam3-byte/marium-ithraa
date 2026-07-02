import { ParentOrgChildrenScreen } from '@/components/pages/dashboards/parent/ParentOrgChildrenScreen'
import { ParentPrivateChildrenScreen } from '@/components/pages/dashboards/parent/ParentPrivateChildrenScreen'
import { getOrgChildren, getPrivateChildren } from '@/features/children'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ParentChildrenPage({ params }: Props) {
  await params
  const { children: privateChildren } = await getPrivateChildren()
  const { children: orgChildren } = await getOrgChildren()
  return (
    <>
      <ParentPrivateChildrenScreen privateChildren={privateChildren} />
      <ParentOrgChildrenScreen orgChildren={orgChildren} />
    </>
  )
}
