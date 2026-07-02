'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { showErrorToast } from '@/lib/toast/app-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useStartEvaluation } from '@/features/evaluations/hooks'
import { startAttemptSchema } from '@/features/evaluations/types'

export default function StartEvaluationPage() {
  const t = useTranslations('StartEvaluation')
  const params = useParams<{ evaluationId: string }>()
  const router = useRouter()
  const evaluationId = params.evaluationId
  const start = useStartEvaluation(evaluationId)

  const [childId, setChildId] = useState('')
  const [childType, setChildType] = useState<'organization' | 'private'>('private')
  const [expiresInSeconds, setExpiresInSeconds] = useState<string>('')

  const payload = useMemo(() => {
    const maybe = {
      childId,
      childType,
      expiresInSeconds: expiresInSeconds ? Number(expiresInSeconds) : undefined,
    }
    const parsed = startAttemptSchema.safeParse(maybe)
    return parsed.success ? parsed.data : null
  }, [childId, childType, expiresInSeconds])

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="space-y-1">
          <label className="text-sm">{t('expiresInSeconds')}</label>
          <Input
            value={expiresInSeconds}
            onChange={(e) => setExpiresInSeconds(e.target.value)}
            placeholder={t('expiresPlaceholder')}
            inputMode="numeric"
          />
        </div>

        <Button
          onClick={async () => {
            if (!payload) {
              showErrorToast({ raw: t('errorMessage') })
              return
            }
            try {
              const attempt = await start.mutateAsync(payload)
              router.push(`/dashboards/parent/attempts/${attempt.id}`)
            } catch (e: unknown) {
              showErrorToast({ raw: e instanceof Error ? e.message : t('errorFailed') })
            }
          }}
          disabled={start.isPending}
        >
          {start.isPending ? t('starting') : t('start')}
        </Button>

        <p className="text-xs text-muted-foreground">{t('helperText')}</p>
      </CardContent>
    </Card>
  )
}
