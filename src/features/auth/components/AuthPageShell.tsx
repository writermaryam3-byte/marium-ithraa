'use client'

import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthPageShellProps {
  title: string
  children: React.ReactNode
  backHref?: string
  backLabel?: string
  sideTitle?: string
  sideSubtitle?: string
  cardClassName?: string
  headerExtra?: React.ReactNode
  footer?: React.ReactNode
}

export function AuthPageShell({
  title,
  children,
  backHref = '/',
  backLabel,
  sideTitle,
  sideSubtitle,
  cardClassName,
  headerExtra,
  footer,
}: AuthPageShellProps) {
  const t = useTranslations('auth')
  const tHero = useTranslations('landing.hero')
  const showHero = Boolean(sideTitle)

  return (
    <main id="main-content" className="min-h-dvh pt-36 pb-16">
      <div className="app-container">
        <div
          className={cn(
            'mx-auto grid w-full items-start gap-10',
            showHero ? 'max-w-5xl lg:grid-cols-2 lg:items-center' : 'max-w-lg',
          )}
        >
          <div className={cn('mx-auto w-full', showHero ? 'max-w-md lg:max-w-none' : 'max-w-lg')}>
            <Button
              asChild
              variant="ghost"
              className="mb-4 -ms-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href={backHref}>
                <ArrowLeft className="size-4 rtl:rotate-180" />
                {backLabel ?? t('backToHome')}
              </Link>
            </Button>

            <Card
              className={cn(
                'w-full border-amber-50 bg-white/95 shadow-md backdrop-blur-sm',
                cardClassName,
              )}
            >
              <CardHeader className="space-y-3 pb-4">
                <div className="flex items-center justify-center">
                  <Link href="/" className="transition-opacity hover:opacity-80">
                    <Image
                      src="/logo.svg"
                      alt={tHero('brandAlt')}
                      width={160}
                      height={48}
                      className="h-10 w-auto"
                      priority
                    />
                  </Link>
                </div>
                <CardTitle className="text-center text-2xl font-bold text-blue-500">
                  {title}
                </CardTitle>
                {headerExtra}
              </CardHeader>
              <CardContent className="space-y-6">
                {children}
                {footer}
              </CardContent>
            </Card>
          </div>

          {showHero && (
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/20" />
                <div className="relative p-10">
                  <Image
                    src="/hero.png"
                    alt=""
                    width={520}
                    height={520}
                    className="h-auto w-full"
                    priority
                  />
                  <p className="mt-6 text-lg font-semibold text-foreground">{sideTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{sideSubtitle}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
