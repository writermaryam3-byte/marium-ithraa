import * as React from 'react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export type ActivityItem = {
  id: string
  title: string
  timeAgo: string
  icon?: React.ReactNode
}

export type ActivityFeedProps = {
  title: string
  items: ActivityItem[]
  className?: string
}

export function ActivityFeed({ title, items, className }: ActivityFeedProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <h2 className="text-xl font-bold text-foreground text-start">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="rounded-2xl border bg-card shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3 min-w-0">
                {item.icon ? (
                  <div className="grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground [&_svg]:size-5">
                    {item.icon}
                  </div>
                ) : null}
                <div className="min-w-0 text-start">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold text-primary">{item.timeAgo}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
