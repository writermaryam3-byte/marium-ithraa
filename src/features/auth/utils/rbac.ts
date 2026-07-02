import { UserRole } from '@/lib/types/enums'
import type { Role } from '@/features/users/types'

export function roleNames(roles: Role[] | undefined | null): UserRole[] {
  if (!roles) return []
  const names = roles.map((r) => r?.name).filter(Boolean) as string[]
  // Backend sends string role names; cast to UserRole when possible.
  return names.filter((n): n is UserRole =>
    Object.values(UserRole).includes(n as UserRole),
  ) as UserRole[]
}

export function hasAnyRole(
  userRoles: Role[] | undefined | null,
  allowed: UserRole[] | undefined | null,
): boolean {
  if (!allowed || allowed.length === 0) return true
  const normalized = new Set(roleNames(userRoles))
  return allowed.some((r) => normalized.has(r))
}
