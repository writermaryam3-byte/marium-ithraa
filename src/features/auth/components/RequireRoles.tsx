import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'

import nextAuthOptions from '@/server/auth'
import { Routes } from '@/lib/types/enums'
import { hasAnyRole } from '@/features/auth/utils/rbac'
import type { UserRole } from '@/lib/types/enums'
import { redirect } from '@/i18n/navigation'

export default async function RequireRoles({
  children,
  locale,
  allowed,
  redirectTo,
}: {
  children: ReactNode
  allowed: UserRole[]
  redirectTo?: string
  locale: string
}) {
  const session = await getServerSession(nextAuthOptions)
  if (!session?.user) {
    return redirect({ href: redirectTo ?? `/${Routes.AUTH}/login`, locale })
  }

  const ok = hasAnyRole(session.user.roles, allowed)
  if (!ok) redirect({ href: redirectTo ?? `/${Routes.UNAUTHORIZED}`, locale })

  return children
}
