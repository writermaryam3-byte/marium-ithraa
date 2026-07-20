'use client'

import { Loader2, Play, PlayCircle, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import type { EvaluationActionState } from '@/features/evaluations/utils/evaluation-action'
import { getEvaluationActionLabelKey } from '@/features/evaluations/utils/evaluation-action'

type Props = {
  action: EvaluationActionState
  attemptHref?: string
  isPending?: boolean
  onStart?: () => void
}

const ICONS = {
  continue: PlayCircle,
  start: Play,
  startNew: RotateCcw,
  blocked: Play,
} as const

export function EvaluationActionButton({
  action,
  attemptHref,
  isPending = false,
  onStart,
}: Props) {
  const t = useTranslations('evaluations')
  const Icon = ICONS[action.kind]
  const labelKey = getEvaluationActionLabelKey(action.kind)
  const label = t(labelKey)
  const blockedReason = action.blockedReasonKey ? t(action.blockedReasonKey) : undefined

  if (action.kind === 'continue' && attemptHref) {
    return (
      <Button asChild className="gap-2">
        <Link href={attemptHref} title={label} aria-label={label}>
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      </Button>
    )
  }

  if (action.kind === 'blocked') {
    const disabledLabel = blockedReason ?? t('startEvaluation')
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          type="button"
          disabled
          className="gap-2"
          title={disabledLabel}
          aria-label={disabledLabel}
        >
          <Icon className="h-4 w-4" />
          {disabledLabel}
        </Button>
      </div>
    )
  }

  return (
    <Button
      type="button"
      className="gap-2"
      disabled={!action.enabled || isPending}
      title={label}
      aria-label={label}
      onClick={onStart}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </Button>
  )
}
