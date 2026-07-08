'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/errors/ApiError'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ErrorCardProps = {
  title?: string
  message?: string
  error?: ApiError | Error
  icon?: ReactNode
  retry?: {
    label?: string
    onClick: () => void
  }
  technicalDetails?: string
  className?: string
}

function getErrorMessage(error: ApiError | Error | undefined): string {
  if (!error) return ''
  if (error instanceof ApiError) return error.message
  return error.message
}

function getTechnicalDetails(error: ApiError | Error | undefined): string | undefined {
  if (!error) return undefined
  if (error instanceof ApiError && error.status) {
    return `HTTP ${error.status}: ${error.message}`
  }
  return undefined
}

const ErrorCard = ({
  error,
  title,
  message,
  icon,
  retry,
  technicalDetails,
  className,
}: ErrorCardProps) => {
  const t = useTranslations('errors.errorCard')
  const tb = useTranslateBackend()
  const resolvedTitle = title ?? t('defaultTitle')
  const errorMessage = message || tb(getErrorMessage(error))
  const techDetails = technicalDetails || getTechnicalDetails(error)
  const IconComponent = icon || <AlertTriangle className="size-5 shrink-0" />

  return (
    <Card className={cn('@container/card border-destructive/40 bg-destructive/5', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            {techDetails ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center" aria-label="Error details">
                    {IconComponent}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="max-w-[320px] whitespace-pre-wrap"
                >
                  {techDetails}
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="inline-flex items-center">{IconComponent}</span>
            )}
            {resolvedTitle}
          </CardTitle>
          {errorMessage && (
            <CardDescription className="mt-1 text-destructive/80">{errorMessage}</CardDescription>
          )}
        </div>
      </CardHeader>
      {retry && (
        <CardContent className="pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={retry.onClick}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="size-3.5" />
            {retry.label ?? t('retry')}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

export { ErrorCard }
export default ErrorCard
