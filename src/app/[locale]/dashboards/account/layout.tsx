import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'

import { redirect } from '@/i18n/navigation'
import nextAuthOptions from '@/server/auth'
import { Routes } from '@/lib/types/enums'

export default async function AccountLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getServerSession(nextAuthOptions)

  if (!session?.user) {
    redirect({ href: `/${Routes.AUTH}/login`, locale })
  }

  return children
}
