import * as React from 'react'

import { cn } from '@/lib/utils'
import { StatCard, type StatCardProps } from '@/components/shared/dashboard/StatCard'

export type StatsGridProps = {
  items: StatCardProps[]
  className?: string
}

export function StatsGrid({ items, className }: StatsGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((item) => (
        <StatCard key={String(item.label)} {...item} />
      ))}
    </div>
  )
}
