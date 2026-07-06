'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function GenericResultView({
  result,
  title,
}: {
  result: Record<string, unknown>
  title?: string
}) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Object.entries(result).map(([key, value]) => (
          <div key={key} className="rounded-md border p-3 text-sm">
            <p className="font-medium text-muted-foreground">{key}</p>
            <p className="mt-1 wrap-break-word">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
