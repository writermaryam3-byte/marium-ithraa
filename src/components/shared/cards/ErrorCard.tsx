"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ApiError } from "@/lib/errors/ApiError"
import { AlertTriangle } from "lucide-react"

export type ErrorCardProps = {
  error?: ApiError
  title?: string
}

const ErrorCard = ({ error, title = "Something went wrong" }: ErrorCardProps) => {
  const errorMessage = error?.message || "An unexpected error occurred."

  return (
    <Card className="@container/card border-destructive/40 bg-destructive/5 text-destructive-foreground">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center" aria-label="Error details">
                  <AlertTriangle className="size-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="max-w-[320px] whitespace-pre-wrap">
                {errorMessage}
              </TooltipContent>
            </Tooltip>
            {title}
          </CardTitle>
          <CardDescription className="mt-1">
            Hover the icon for the error details.
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

export default ErrorCard