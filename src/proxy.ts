import createMiddleware from 'next-intl/middleware'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'
import { parsePathname } from '@/lib/i18n/pathname'
import { Pages, Routes, UserRole } from '@/lib/types/enums'
import type { Role } from '@/features/users'

function normalizeUserRoles(roles?: Role[] | UserRole[] | string[]): UserRole[] {
  if (!roles?.length) return []

  if (typeof roles[0] === 'string') {
    return roles as UserRole[]
  }

  return (roles as Role[])
    .map((r) => r.name)
    .filter((name): name is UserRole => Object.values(UserRole).includes(name as UserRole))
}

function roleHome(locale: string, roles?: Role[] | UserRole[] | string[]) {
  const normalized = normalizeUserRoles(roles)
  if (normalized.length > 1) {
    return `/${locale}/${Routes.CHOSEROLE}`
  }

  const base = `/${locale}/${Routes.DASHBOARDS}`

  const map: Partial<Record<UserRole, Pages>> = {
    [UserRole.ADMIN]: Pages.ADMIN,
    [UserRole.ORGANIZATIONOWNER]: Pages.ORGANIZATION,
    [UserRole.TEACHER]: Pages.TEACHER,
    [UserRole.PARENT]: Pages.PARENT,
    [UserRole.ENRICHER]: Pages.ENRICHER,
  }

  const primaryRole = normalized[0]

  return `${base}/${map[primaryRole!] ?? Pages.PARENT}`
}

const AUTH_REQUIRED_ROUTES = [`/${Routes.CHOSEROLE}`]

const PROTECTED_ROUTES = [`/${Routes.DASHBOARDS}`]

const ACCESS_MAP: Record<string, UserRole[]> = {
  [Pages.ORGANIZATION]: [UserRole.ORGANIZATIONOWNER, UserRole.ADMIN],
  [Pages.TEACHER]: [UserRole.TEACHER, UserRole.ADMIN],
  [Pages.ADMIN]: [UserRole.ADMIN],
  [Pages.PARENT]: [UserRole.PARENT, UserRole.ADMIN],
  [Pages.ENRICHER]: [UserRole.ENRICHER],
}

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, pathname: cleanPath, normalizedHref } = parsePathname(pathname)

  if (normalizedHref) {
    const url = request.nextUrl.clone()
    url.pathname = normalizedHref
    return NextResponse.redirect(url)
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
  })

  const isAuthenticated = Boolean(token)
  const isEmailVerified = Boolean(token?.isEmailVerified)
  const isProtected = PROTECTED_ROUTES.some((route) => cleanPath.startsWith(route))

  if (cleanPath.startsWith(`/${Routes.EMAILVERIFICATION}`)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url))
    }
    if (isEmailVerified) {
      return NextResponse.redirect(
        new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url),
      )
    }
    return intlMiddleware(request)
  }

  if (cleanPath.startsWith(`/${Routes.AUTH}`)) {
    if (
      cleanPath.startsWith(`/${Routes.AUTH}/forgot-password`) ||
      cleanPath.startsWith(`/${Routes.AUTH}/reset-password`)
    ) {
      return intlMiddleware(request)
    }

    if (!isAuthenticated) {
      return intlMiddleware(request)
    }

    if (!isEmailVerified) {
      return NextResponse.redirect(new URL(`/${locale}/${Routes.EMAILVERIFICATION}`, request.url))
    }

    return NextResponse.redirect(
      new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url),
    )
  }

  if (cleanPath.startsWith('/verify-email')) {
    return intlMiddleware(request)
  }

  const requiresAuth = AUTH_REQUIRED_ROUTES.some((route) => cleanPath.startsWith(route))

  if (!isAuthenticated && requiresAuth) {
    return NextResponse.redirect(new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url))
  }

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url))
  }

  if (isAuthenticated && !isEmailVerified && isProtected) {
    return NextResponse.redirect(new URL(`/${locale}/${Routes.EMAILVERIFICATION}`, request.url))
  }

  if (isAuthenticated && isProtected && isEmailVerified) {
    const parts = cleanPath.split('/').filter(Boolean)
    const section = parts[1]

    if (section) {
      const allowedRoles = ACCESS_MAP[section]
      const normalizedRoles = normalizeUserRoles(token?.roles as Role[] | undefined)

      if (
        allowedRoles &&
        normalizedRoles.length > 0 &&
        !normalizedRoles.some((role) => allowedRoles.includes(role))
      ) {
        return NextResponse.redirect(
          new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url),
        )
      }
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
