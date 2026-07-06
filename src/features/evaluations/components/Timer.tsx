'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

function formatMs(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
  return `${m}:${pad(s)}`
}

export default function Timer({ remainingMs }: { remainingMs: number | null }) {
  const { label, variant } = useMemo(() => {
    if (remainingMs === null) return { label: 'No time limit', variant: 'secondary' as const }
    if (remainingMs <= 0) return { label: 'Expired', variant: 'destructive' as const }
    if (remainingMs <= 60_000)
      return { label: formatMs(remainingMs), variant: 'destructive' as const }
    if (remainingMs <= 5 * 60_000)
      return { label: formatMs(remainingMs), variant: 'secondary' as const }
    return { label: formatMs(remainingMs), variant: 'outline' as const }
  }, [remainingMs])

  return (
    <Badge
      variant={variant}
      className={cn(
        'font-mono tabular-nums',
        remainingMs !== null && remainingMs <= 60_000 && 'animate-pulse',
      )}
      aria-label="Remaining time"
    >
      {label}
    </Badge>
  )
}
