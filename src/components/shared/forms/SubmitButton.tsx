'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
  loadingText?: string
}

export function SubmitButton({
  children,
  loading = false,
  loadingText,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}
