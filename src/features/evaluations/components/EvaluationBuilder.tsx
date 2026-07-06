'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast } from '@/lib/toast/app-toast'
import { useRouter } from '@/i18n/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStartEvaluation } from '@/features/evaluations/hooks'
import { startAttemptSchema } from '@/features/evaluations/types'

export default function EvaluationBuilder({ evaluationId }: { evaluationId: string }) {
  const t = useTranslations('EvaluationBuilder')
  const router = useRouter()
  const start = useStartEvaluation(evaluationId)
  const [childId, setChildId] = useState('')
  const [childType, setChildType] = useState<'organization' | 'private'>('private')

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm">{t('childId')}</label>
          <Input
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            placeholder={t('childIdPlaceholder')}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">{t('childType')}</label>
          <select
            value={childType}
            onChange={(e) => setChildType(e.target.value as 'organization' | 'private')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          >
            <option value="private">{t('privateOption')}</option>
            <option value="organization">{t('organizationOption')}</option>
          </select>
        </div>
        <Button
          onClick={async () => {
            const parsed = startAttemptSchema.safeParse({ childId, childType })
            if (!parsed.success) {
              showErrorToast({ raw: t('errorMessage') })
              return
            }
            try {
              const attempt = await start.mutateAsync(parsed.data)
              router.push(`/dashboards/parent/attempts/${attempt.id}`)
            } catch (e: unknown) {
              showErrorToast({ raw: e instanceof Error ? e.message : t('errorFailed') })
            }
          }}
          disabled={start.isPending}
        >
          {start.isPending ? t('starting') : t('startAttempt')}
        </Button>
        <p className="text-xs text-muted-foreground">{t('info')}</p>
      </CardContent>
    </Card>
  )
}
