// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { parsePathname, toAppPath, toLocalizedHref } from '@/lib/i18n/pathname'

describe('parsePathname', () => {
  it('extracts locale and pathname from a localized path', () => {
    expect(parsePathname('/ar/dashboards/parent')).toEqual({
      locale: 'ar',
      pathname: '/dashboards/parent',
      normalizedHref: null,
    })
  })

  it('normalizes duplicate locale segments', () => {
    expect(parsePathname('/ar/ar/dashboard')).toEqual({
      locale: 'ar',
      pathname: '/dashboard',
      normalizedHref: '/ar/dashboard',
    })
  })

  it('normalizes mixed locale segments', () => {
    expect(parsePathname('/en/ar/dashboard')).toEqual({
      locale: 'en',
      pathname: '/dashboard',
      normalizedHref: '/en/dashboard',
    })

    expect(parsePathname('/ar/en/profile')).toEqual({
      locale: 'ar',
      pathname: '/profile',
      normalizedHref: '/ar/profile',
    })
  })

  it('defaults locale for paths without a prefix', () => {
    expect(parsePathname('/dashboards/admin')).toEqual({
      locale: 'ar',
      pathname: '/dashboards/admin',
      normalizedHref: null,
    })
  })
})

describe('toAppPath', () => {
  it('strips locale prefixes for next-intl navigation', () => {
    expect(toAppPath('/ar/dashboards/notifications')).toBe('/dashboards/notifications')
    expect(toAppPath('/en/ar/dashboards/parent')).toBe('/dashboards/parent')
  })

  it('preserves query params and hash', () => {
    expect(toAppPath('/ar/auth/login?next=/dashboards&tab=1#top')).toBe(
      '/auth/login?next=/dashboards&tab=1#top',
    )
  })
})

describe('toLocalizedHref', () => {
  it('builds locale-prefixed paths for hard navigation', () => {
    expect(toLocalizedHref('/auth/login', 'en')).toBe('/en/auth/login')
    expect(toLocalizedHref('/ar/auth/login', 'en')).toBe('/en/auth/login')
  })
})
