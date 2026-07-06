import { ParentOrgChildrenScreen } from '@/features/parent/components/ParentOrgChildrenScreen'
import { ParentPrivateChildrenScreen } from '@/features/parent/components/ParentPrivateChildrenScreen'
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
