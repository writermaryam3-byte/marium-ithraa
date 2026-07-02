'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type ChildCardProps = {
  name: string
  className: string
  evaluationStatus: string
  evaluationStatusClassName?: string
  imageSrc?: string
  editLabel: string
  deleteLabel: string
  onEdit?: () => void
  onDelete?: () => void
}

export const ChildCard = React.memo(function ChildCard({
  name,
  className,
  evaluationStatus,
  evaluationStatusClassName,
  imageSrc = '/avatar-placeholder.svg',
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
}: ChildCardProps) {
  return (
    <Card className="rounded-2xl border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Avatar className="size-20 rounded-xl">
            <AvatarImage src={imageSrc} alt={name} className="rounded-xl object-cover" />
            <AvatarFallback className="rounded-xl text-xs">CH</AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1 text-start text-sm">
            <p className="truncate">
              <span className="font-semibold text-foreground">الإسم:</span>{' '}
              <span className="text-muted-foreground">{name}</span>
            </p>
            <p className="truncate">
              <span className="font-semibold text-foreground">الفصل:</span>{' '}
              <span className="text-muted-foreground">{className}</span>
            </p>
            <p className="truncate">
              <span className="font-semibold text-foreground">التقييم:</span>{' '}
              <span
                className={cn('font-semibold', evaluationStatusClassName ?? 'text-emerald-600')}
              >
                {evaluationStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-fuchsia-500/60 text-fuchsia-600 hover:bg-fuchsia-50"
            onClick={onDelete}
          >
            {deleteLabel}
          </Button>
          <Button variant="gradient" type="button" className="rounded-xl" onClick={onEdit}>
            {editLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})
