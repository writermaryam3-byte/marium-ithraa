'use client'

import * as React from 'react'
import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  description: string
  href: string
  icon?: ReactNode
  actionLabel: string
  className?: string
}

export const QuickActionCard = React.memo(function QuickActionCard({
  title,
  description,
  href,
  icon,
  actionLabel,
  className,
}: Props) {
  return (
    <Card
      className={cn(
        'rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-4 p-5 text-start">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-fuchsia-600 [&_svg]:size-5">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 space-y-1">
            <p className="font-bold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button variant="gradient" asChild className="mt-auto w-full rounded-xl">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  )
})
