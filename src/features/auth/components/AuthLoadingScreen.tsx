'use client'

import { Loader2 } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

export function AuthLoadingScreen({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
      <Loader2 className="size-8 animate-spin text-fuchsia-600" />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
      <div className="grid w-full max-w-md gap-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  )
}
