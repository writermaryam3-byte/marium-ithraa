import type { Role } from '@/features/users'
import { Pages, Routes, UserRole } from '@/lib/types/enums'

import { roleNames } from './rbac'

const DASHBOARD_BY_ROLE: Partial<Record<UserRole, string>> = {
  [UserRole.ADMIN]: `/${Routes.DASHBOARDS}/${Pages.ADMIN}`,
  [UserRole.ORGANIZATIONOWNER]: `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`,
  [UserRole.TEACHER]: `/${Routes.DASHBOARDS}/${Pages.TEACHER}`,
  [UserRole.PARENT]: `/${Routes.DASHBOARDS}/${Pages.PARENT}`,
  [UserRole.ENRICHER]: `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`,
}

export function getLoginPath(): string {
  return `/${Routes.AUTH}/${Pages.LOGIN}`
}

export function getDashboardPathForRole(role: UserRole | string): string {
  return DASHBOARD_BY_ROLE[role as UserRole] ?? `/${Routes.DASHBOARDS}`
}

export function getDashboardPathForRoles(roles: Role[] | undefined | null): string {
  const names = roleNames(roles)
  if (names.length === 0) return `/${Routes.DASHBOARDS}`
  if (names.length > 1) return `/${Routes.CHOSEROLE}`
  return getDashboardPathForRole(names[0])
}

export function getPostLoginRedirect(
  roles: Role[] | undefined | null,
  options?: { isEmailVerified?: boolean; locale?: string },
): string {
  const prefix = options?.locale ? `/${options.locale}` : ''

  if (options?.isEmailVerified === false) {
    return `${prefix}/${Routes.EMAILVERIFICATION}`
  }

  const names = roleNames(roles)
  if (names.length > 1) {
    return `${prefix}/${Routes.CHOSEROLE}`
  }

  const path = getDashboardPathForRoles(roles)
  return options?.locale ? `${prefix}${path}` : path
}
