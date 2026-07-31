import type { Role } from '@/features/users'
import { toLocalizedHref } from '@/lib/i18n/pathname'
import { Pages, Routes, UserRole } from '@/lib/types/enums'

import { roleNames } from './rbac'

const DASHBOARD_BY_ROLE: Partial<Record<UserRole, string>> = {
  [UserRole.ADMIN]: `/${Routes.DASHBOARDS}/${Pages.ADMIN}`,
  [UserRole.ORGANIZATIONOWNER]: `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`,
  [UserRole.TEACHER]: `/${Routes.DASHBOARDS}/${Pages.TEACHER}`,
  [UserRole.PARENT]: `/${Routes.DASHBOARDS}/${Pages.PARENT}`,
  [UserRole.ENRICHER]: `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`,
}

/** Locale-agnostic app path for next-intl Link/router/redirect APIs. */
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

/** Locale-agnostic dashboard home for next-intl Link/router breadcrumbs. */
export function getDashboardHomePath(roles: Role[] | undefined | null): string {
  return getDashboardPathForRoles(roles)
}

export function getPostLoginRedirect(
  roles: Role[] | undefined | null,
  options?: { isEmailVerified?: boolean; locale?: string },
): string {
  if (options?.isEmailVerified === false) {
    const path = `/${Routes.EMAILVERIFICATION}`
    return options.locale ? toLocalizedHref(path, options.locale) : path
  }

  const names = roleNames(roles)
  if (names.length > 1) {
    const path = `/${Routes.CHOSEROLE}`
    return options?.locale ? toLocalizedHref(path, options.locale) : path
  }

  const path = getDashboardPathForRoles(roles)
  return options?.locale ? toLocalizedHref(path, options.locale) : path
}

export function getLocalizedLoginPath(locale: string): string {
  return toLocalizedHref(getLoginPath(), locale)
}
