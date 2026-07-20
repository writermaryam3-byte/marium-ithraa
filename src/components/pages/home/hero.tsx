'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Pages, Routes } from '@/lib/types/enums'
import { cn } from '@/lib/utils'

const Hero = () => {
  const locale = useLocale()
  const t = useTranslations('landing.hero')
  const isRtl = locale === 'ar'

  const baseAuth = `/${Routes.AUTH}`

  const cards = [
    {
      key: 'beneficiary' as const,
      href: `${baseAuth}/${Pages.BENEFICIARYSIGNUP}`,
      tone: 'hover:border-purple-500/40 hover:bg-purple-500/5',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 400px at 85% 30%, color-mix(in oklab, #a855f7 12%, transparent), transparent 65%), radial-gradient(800px 350px at 15% 70%, color-mix(in oklab, #ec4899 10%, transparent), transparent 60%)',
        }}
      />

      <div className="app-container relative pt-36 pb-14 lg:pt-44 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 text-start lg:order-1 relative z-10">
            <h1 className="text-3xl font-black leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-5xl tracking-tight">
              {t('title')}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg font-medium">
              {t('subtitle')}
            </p>

            <div className="mt-10">
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 sm:text-xl flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-purple-500" />
                {t('cardsTitle')}
              </h2>

              <div className="mt-4 grid gap-3 max-w-md">
                {cards.map((c) => (
                  <Button
                    key={c.key}
                    asChild
                    className={cn(
                      'h-auto w-full justify-between rounded-2xl border border-purple-500/10 bg-purple-500/5 dark:bg-purple-500/10 px-5 py-4 shadow-sm transition-all duration-300',
                      c.tone,
                    )}
                  >
                    <Link href={c.href} className="w-full flex items-center justify-between gap-4">
                      <span className="min-w-0 text-start">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
                          {t(`cards.${c.key}.label`)}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground sm:text-sm font-normal">
                          {t(`cards.${c.key}.description`)}
                        </span>
                      </span>

                      <span className="shrink-0 text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-[-4px]">
                        {isRtl ? (
                          <ArrowLeft className="size-4" />
                        ) : (
                          <ArrowRight className="size-4" />
                        )}
                      </span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <Image
                src="/hero.png"
                alt={t('heroImageAlt')}
                width={760}
                height={620}
                className="h-auto w-full drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
