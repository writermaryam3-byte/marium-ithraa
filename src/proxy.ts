import createMiddleware from 'next-intl/middleware'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'
import { Pages, Routes, UserRole } from '@/lib/types/enums'
import type { Role } from '@/features/users'

function getLocale(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0] as (typeof routing.locales)[number] | undefined
  return seg && routing.locales.includes(seg) ? seg : routing.defaultLocale
}

function stripLocale(pathname: string, locale: string): string {
  const prefix = `/${locale}`
  if (pathname === prefix) return '/'
  if (pathname.startsWith(prefix + '/')) return pathname.slice(prefix.length)
  return pathname
}

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

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const intlMiddleware = createMiddleware(routing)

  // 1. احسب الـ locale والـ cleanPath الأول من الـ request مباشرة
  const locale = getLocale(pathname)
  const cleanPath = stripLocale(pathname, locale)

  // 2. جيب التوكن
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

  // 3. شروط التوجيه (Redirects) تفضل زي ما هي تماماً:
  if (cleanPath.startsWith(`/${Routes.EMAILVERIFICATION}`)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url))
    }
    if (isEmailVerified) {
      return NextResponse.redirect(
        new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url),
      )
    }
    // بدال ما ترجع intlResponse جاهز، ناديه هنا مباشرة:
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
      // هنا الحل! ناديه لما تحتاجه فعلياً عشان يعمل الـ Rewrite صح في وقته
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

  // 4. في النهاية لو مفيش أي شرط Redirect تحقق، شغل الـ intlMiddleware
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}