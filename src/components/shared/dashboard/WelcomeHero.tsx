import * as React from 'react'

import { cn } from '@/lib/utils'

export type WelcomeHeroProps = {
  title: string
  subtitle?: string
  illustration?: React.ReactNode
  className?: string
}

export function WelcomeHero({ title, subtitle, illustration, className }: WelcomeHeroProps) {
  return (
    <section className={cn('grid items-center gap-6 lg:grid-cols-[1fr_auto]', className)}>
      <div className="space-y-2 text-start">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {subtitle ? <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
      </div>
      {illustration ? (
        <div className="hidden lg:block">{illustration}</div>
      ) : (
        <div className="hidden lg:block">
          <div className="relative h-32 w-64 overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="absolute -start-12 -top-10 size-40 rounded-full bg-primary/15" />
            <div className="absolute -end-10 -bottom-12 size-44 rounded-full bg-accent/20" />
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
              <span className="text-sm font-semibold">Ithraa</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
