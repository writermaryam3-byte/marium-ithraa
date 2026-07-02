'use client'

import { Link, usePathname } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

import { AuthNavActions } from '@/features/auth/components/AuthNavActions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Searchbar from '@/components/layouts/header/search'
import { ApprovalStatus } from '@/lib/types/enums'

type OrganizationHeaderProps = {
  locale: string
  approvalStatus?: ApprovalStatus
}

const navLinks = [
  { labelKey: 'home', href: '/dashboards/organization' },
  { labelKey: 'grades', href: '/dashboards/organization/grades' },
  { labelKey: 'classes', href: '/dashboards/organization/classes' },
  { labelKey: 'children', href: '/dashboards/organization/children' },
  { labelKey: 'teachers', href: '/dashboards/organization/teachers' },
  { labelKey: 'deals', href: '/dashboards/organization/deals' },
  { labelKey: 'results', href: '/dashboards/organization/results' },
] as const

const operationalLinkHrefs = new Set([
  '/dashboards/organization/grades',
  '/dashboards/organization/classes',
  '/dashboards/organization/children',
  '/dashboards/organization/teachers',
  '/dashboards/organization/deals',
])

const OrganizationHeader = ({
  locale,
  approvalStatus = ApprovalStatus.APPROVED,
}: OrganizationHeaderProps) => {
  const pathname = usePathname()
  const t = useTranslations('Layout.OrganizationNav')
  const [mobileOpen, setMobileOpen] = useState(false)
  const isApproved = approvalStatus === ApprovalStatus.APPROVED

  const visibleLinks = navLinks.filter((item) => {
    if (isApproved) return true
    return !operationalLinkHrefs.has(item.href)
  })

  const isActive = (href: string) => {
    if (href === '/dashboards/organization') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-6 inset-s-0 z-50 w-full">
      <div className="app-container">
        <div
          className={[
            'relative flex items-center justify-between gap-3',
            'rounded-[64px] border border-amber-50/70 bg-white/80 shadow-md backdrop-blur-md',
            'px-4 py-3 lg:px-6 lg:py-4',
          ].join(' ')}
        >
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="logo"
              width={170}
              height={48}
              className="h-10 w-auto lg:h-12"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {visibleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-full text-base font-semibold',
                  'transition-colors',
                  isActive(item.href)
                    ? 'text-fuchsia-600 bg-fuchsia-50'
                    : 'text-foreground/70 hover:text-foreground hover:bg-primary/10',
                )}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Searchbar />
            <div className="hidden lg:flex">
              <AuthNavActions locale={locale} showNotifications showLanguage />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="lg:hidden rounded-full"
              onClick={() => setMobileOpen(true)}
              aria-label={t('menu')}
            >
              <Menu />
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden">
            <button
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label={t('menu')}
            />
            <div className="fixed top-0 inset-x-0 z-50 p-4">
              <div className="mx-auto max-w-lg rounded-3xl border bg-background shadow-lg">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-semibold">{t('menu')}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => setMobileOpen(false)}
                    aria-label={t('menu')}
                  >
                    <X />
                  </Button>
                </div>

                <div className="p-4 space-y-2">
                  {visibleLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block rounded-2xl px-4 py-3 text-base font-semibold transition-colors',
                        isActive(item.href)
                          ? 'text-fuchsia-600 bg-fuchsia-50'
                          : 'text-foreground/80 hover:bg-primary/10 hover:text-foreground',
                      )}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ))}

                  <div className="pt-2">
                    <AuthNavActions locale={locale} showNotifications />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default OrganizationHeader
