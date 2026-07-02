import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export type StatCardVariant = 'purple' | 'violet' | 'pink' | 'indigo'

const variantClasses: Record<StatCardVariant, string> = {
  purple: 'bg-stat-purple text-white',
  violet: 'bg-stat-violet text-white',
  pink: 'bg-stat-pink text-white',
  indigo: 'bg-stat-indigo text-white',
}

export type StatCardProps = {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  variant?: StatCardVariant
  className?: string
}

export const StatCard = React.memo(function StatCard({
  label,
  value,
  icon,
  variant = 'purple',
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'border-0 shadow-sm',
        variantClasses[variant],
        'overflow-hidden rounded-2xl',
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm/6 font-semibold opacity-95">{label}</div>
            <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
          </div>
          {icon ? (
            <div className="shrink-0 rounded-2xl bg-white/10 p-3 text-white [&_svg]:size-6">
              {icon}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
})
