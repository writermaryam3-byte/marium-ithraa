import { routing } from '@/i18n/routing'

type Locale = (typeof routing.locales)[number]

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale)
}

export type ParsedPathname = {
  locale: Locale
  /** Path without any locale prefix, always starts with `/` */
  pathname: string
  /** Set when the URL contains duplicate or mixed locale segments */
  normalizedHref: string | null
}

function splitHref(href: string): { pathname: string; suffix: string } {
  const queryIndex = href.indexOf('?')
  const hashIndex = href.indexOf('#')
  const cutIndex = Math.min(
    queryIndex === -1 ? href.length : queryIndex,
    hashIndex === -1 ? href.length : hashIndex,
  )

  return {
    pathname: href.slice(0, cutIndex) || '/',
    suffix: href.slice(cutIndex),
  }
}

export function parsePathname(pathname: string): ParsedPathname {
  const { pathname: pathOnly } = splitHref(pathname)
  const segments = pathOnly.split('/').filter(Boolean)

  if (segments.length === 0 || !isLocale(segments[0]!)) {
    return {
      locale: routing.defaultLocale,
      pathname: pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`,
      normalizedHref: null,
    }
  }

  const locale = segments[0]
  let index = 1

  while (index < segments.length && isLocale(segments[index]!)) {
    index++
  }

  const rest = segments.slice(index)
  const pathnameWithoutLocale = rest.length > 0 ? `/${rest.join('/')}` : '/'
  const normalizedHref =
    index > 1
      ? `/${locale}${pathnameWithoutLocale === '/' ? '' : pathnameWithoutLocale}`
      : null

  return {
    locale,
    pathname: pathnameWithoutLocale,
    normalizedHref,
  }
}

/** Strip locale prefix(es) from an internal href for next-intl navigation APIs. */
export function toAppPath(href: string): string {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      const url = new URL(href)
      return toAppPath(`${url.pathname}${url.search}${url.hash}`)
    } catch {
      return href
    }
  }

  if (!href.startsWith('/')) {
    return href
  }

  const { pathname, suffix } = splitHref(href)
  const parsed = parsePathname(pathname)
  return `${parsed.pathname}${suffix}`
}

/** Build a locale-prefixed href for hard navigations (window.location, NextAuth callbackUrl). */
export function toLocalizedHref(path: string, locale?: string): string {
  const resolvedLocale = locale ?? routing.defaultLocale

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const appPath = toAppPath(path)
  if (appPath === '/') {
    return `/${resolvedLocale}`
  }

  return `/${resolvedLocale}${appPath.startsWith('/') ? appPath : `/${appPath}`}`
}

/** Read the active locale from a browser pathname. */
export function getLocaleFromWindowPathname(pathname = typeof window === 'undefined' ? '/' : window.location.pathname): Locale {
  return parsePathname(pathname).locale
}
