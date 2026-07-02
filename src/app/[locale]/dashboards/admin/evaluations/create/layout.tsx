import type { ReactNode } from 'react'

import RequireRoles from '@/features/auth/components/RequireRoles'
import { UserRole } from '@/lib/types/enums'

export default async function AdminEvalCreateLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <RequireRoles allowed={[UserRole.ADMIN]} redirectTo="/unauthorized" locale={locale}>
      {children}
    </RequireRoles>
  )
}
