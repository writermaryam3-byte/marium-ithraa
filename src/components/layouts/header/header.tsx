'use client'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { AuthNavActions } from '@/features/auth/components/AuthNavActions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Searchbar from './search'
import { Menu, X } from 'lucide-react'

const Header = ({ locale }: { locale: string }) => {
  const t = useTranslations('Header')
  const tAuth = useTranslations('Auth')
  const { isAuthenticated, logout, loginPath } = useAuth()
  const navLinks = [
    {
      label: t('Menu.Home'),
      target: '/',
    },
    {
      label: t('Menu.About'),
      target: '/about',
    },
    // {
    //     label: t("Menu.Services"),
    //     target: "/d"
    // },
    // {
    //     label: t("Menu.Blog"),
    //     target: "/c"
    // },
    // {
    //     label: t("Menu.Contact"),
    //     target: "/cv"
    // },
  ]

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-6 inset-s-0 w-full z-50">
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
            {navLinks.map(({ target, label }) => (
              <Link
                key={target}
                href={target}
                className={[
                  'px-4 py-2 rounded-full text-base font-semibold capitalize',
                  'text-foreground/70 hover:text-foreground',
                  'hover:bg-primary/10 transition-colors',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Searchbar />
            <div className="hidden lg:block">
              <AuthNavActions locale={locale} />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="lg:hidden rounded-full"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
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
              aria-label="Close menu overlay"
            />
            <div className="fixed top-0 inset-x-0 z-50 p-4">
              <div className="mx-auto max-w-lg rounded-3xl border bg-background shadow-lg">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-semibold">{t('Menu.Home')}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X />
                  </Button>
                </div>

                <div className="p-4 space-y-2">
                  {navLinks.map(({ target, label }) => (
                    <Link
                      key={target}
                      href={target}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-base font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-2xl"
                      onClick={() => {
                        setMobileOpen(false)
                        void logout()
                      }}
                    >
                      {tAuth('logout')}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
                    >
                      <Link href={loginPath} onClick={() => setMobileOpen(false)}>
                        {t('login')}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
