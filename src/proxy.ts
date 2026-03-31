import createMiddleware from "next-intl/middleware"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "./i18n/routing"
import { Pages, Routes, UserRole } from "@/lib/types/enums"
import type { Role } from "@/features/users"

const intlMiddleware = createMiddleware(routing)

function getLocale(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0] as (typeof routing.locales)[number] | undefined
  return seg && routing.locales.includes(seg)
    ? seg
    : routing.defaultLocale
}

function stripLocale(pathname: string, locale: string): string {
  const prefix = `/${locale}`
  if (pathname === prefix) return "/"
  if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length)
  return pathname
}

function normalizeUserRoles(roles?: Role[] | UserRole[] | string[]): UserRole[] {
  if (!roles) return []

  // If roles already look like enums/strings, cast directly
  if (typeof roles[0] === "string") {
    return roles as UserRole[]
  }

  // Otherwise map from Role.name -> UserRole
  return (roles as Role[])
    .map(r => r.name)
    .filter((name): name is UserRole =>
      Object.values(UserRole).includes(name as UserRole)
    )
}

function roleHome(locale: string, roles?: Role[] | UserRole[] | string[]) {
  const base = `/${locale}/${Routes.DASHBOARDS}`

  const map: Partial<Record<UserRole, Pages>> = {
    [UserRole.ADMIN]: Pages.ADMIN,           // ✅ fixed typo: AdMIN → ADMIN
    [UserRole.ORGANIZATIONOWNER]: Pages.ORGANIZATION,
    [UserRole.EMPLOYEE]: Pages.EMPLOYEE,
    [UserRole.ENRICHER]: Pages.ENRICHER,
  }

  const normalized = normalizeUserRoles(roles)
  const primaryRole = normalized[0]

  return `${base}/${map[primaryRole!] ?? Pages.EMPLOYEE}`
}

// Routes that always require authentication
const PROTECTED_ROUTES = [`/${Routes.DASHBOARDS}`]

// ✅ Use string literals that match actual URL segments, not Pages enum values
//    (unless you've verified Pages.ORGANIZATION === "organization" etc.)
const ACCESS_MAP: Record<string, UserRole[]> = {
  [Pages.ORGANIZATION]: [UserRole.ORGANIZATIONOWNER, UserRole.ADMIN],
  [Pages.EMPLOYEE]:     [UserRole.EMPLOYEE, UserRole.ADMIN],
  [Pages.ENRICHER]:     [UserRole.ENRICHER, UserRole.ADMIN],
  [Pages.ADMIN]:        [UserRole.ADMIN],   // ✅ add admin page restriction
}

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request)

  if (intlResponse.headers.get("location")) return intlResponse

  const { pathname } = request.nextUrl
  const locale = getLocale(pathname)
  const cleanPath = stripLocale(pathname, locale)

  // ✅ Bug 1 fixed: add cookieName so getToken works in App Router
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // next-auth v4 default cookie name — adjust if you use a custom one
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  })

  const isAuthenticated = !!token
  const isEmailVerified = !!token?.isEmailVerified
  const isProtected = PROTECTED_ROUTES.some(route => cleanPath.startsWith(route))

  // Special handling: email verification info page (requires auth but not verified)
  if (cleanPath.startsWith(`/${Routes.EMAILVERIFICATION}`)) {
    // Not logged in → go to login
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
      )
    }

    // Already verified → send to role home
    if (isEmailVerified) {
      return NextResponse.redirect(
        new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url)
      )
    }

    // Logged in but not verified → allow
    return intlResponse
  }

  // If hitting pure auth routes (login, signup, etc.)
  if (cleanPath.startsWith(`/${Routes.AUTH}`)) {
    if (!isAuthenticated) {
      return intlResponse
    }

    // Authenticated but email not verified → force email verification page
    if (!isEmailVerified) {
      return NextResponse.redirect(
        new URL(`/${locale}/${Routes.EMAILVERIFICATION}`, request.url)
      )
    }

    // Authenticated & verified → go to dashboard home
    return NextResponse.redirect(
      new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url)
    )
  }

  // Token-based /verify-email page stays public: always allow
  if (cleanPath.startsWith("/verify-email")) {
    return intlResponse
  }

  // Generic protected routes
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(
      new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
    )
  }

  // Authenticated but email not verified and trying to access any protected route
  if (isAuthenticated && !isEmailVerified && isProtected) {
    return NextResponse.redirect(
      new URL(`/${locale}/${Routes.EMAILVERIFICATION}`, request.url)
    )
  }

  // Role-based access control for dashboards
  if (isAuthenticated && isProtected && isEmailVerified) {
    const parts = cleanPath.split("/").filter(Boolean)
    const section = parts[1] // e.g. "admin", "employee", "organization"

    if (section) {
      const allowedRoles = ACCESS_MAP[section]
      const normalizedRoles = normalizeUserRoles(token?.roles as Role[] | undefined)
      const userPrimaryRole = normalizedRoles[0]

      if (allowedRoles && userPrimaryRole && !allowedRoles.includes(userPrimaryRole)) {
        return NextResponse.redirect(
          new URL(roleHome(locale, token?.roles as Role[] | undefined), request.url)
        )
      }
    }
  }

  // ✅ Bug 3 fixed: return intlResponse (which carries next-intl headers)
  //    This is correct — intlMiddleware returns NextResponse.next() with
  //    locale headers set, so we should forward it.
  return intlResponse
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)" ],
}