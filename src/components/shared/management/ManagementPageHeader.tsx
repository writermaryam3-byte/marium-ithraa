import * as React from 'react'
import { Link } from '@/i18n/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type BreadcrumbItem = {
  href?: string
  label: string
}

export type ManagementPageHeaderProps = {
  breadcrumbs: BreadcrumbItem[]
  title: string
  subtitle?: string
  action?: {
    label: string
    href: string
    icon?: React.ReactNode
  }
  className?: string
}

export function ManagementPageHeader({
  breadcrumbs,
  title,
  subtitle,
  action,
  className,
}: ManagementPageHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <nav className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {breadcrumbs.map((b, idx) => {
            const content = b.href ? (
              <Link className="hover:text-foreground" href={b.href}>
                {b.label}
              </Link>
            ) : (
              <span className="text-foreground">{b.label}</span>
            )
            return (
              <li key={`${b.label}-${idx}`} className="flex items-center gap-1">
                {content}
                {idx < breadcrumbs.length - 1 ? <span className="opacity-60">/</span> : null}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1 text-start">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>

        {action ? (
          <Button
            asChild
            variant="outline"
            className="gap-2 rounded-xl border-primary/40 text-primary"
          >
            <Link href={action.href}>
              {action.icon ? <span className="[&_svg]:size-4">{action.icon}</span> : null}
              {action.label}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
