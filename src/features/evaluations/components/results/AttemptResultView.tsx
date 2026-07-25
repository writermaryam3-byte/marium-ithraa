'use client'

import { useTranslations } from 'next-intl'

import type { EvaluationType } from '@/features/evaluations/types'
import { GenericResultView } from './GenericResultView'
import { HollandResult } from './HollandResult'
import { LearningStylesResult } from './LearningStylesResult'
import { MultipleIntelligencesResult } from './MultipleIntelligencesResult'
import { PrideResult } from './PrideResult'
import { RenzulliResult } from './RenzulliResult'

type Props = {
  type: EvaluationType
  result: Record<string, unknown> | null | undefined
  title?: string
  childName?: string
}

export function AttemptResultView({ type, result, title, childName }: Props) {
  const t = useTranslations('evaluations.results')

  if (!result || Object.keys(result).length === 0) {
    return <p className="text-sm text-muted-foreground">{t('noResult')}</p>
  }

  switch (type) {
    case 'multiple_intelligences':
      return <MultipleIntelligencesResult result={result} childName={childName} />
    case 'pride':
      return <PrideResult result={result} />
    case 'renzulli':
      return <RenzulliResult result={result} />
    case 'holland':
      return <HollandResult result={result} />
    case 'learning_styles':
      return <LearningStylesResult result={result} />
    default:
      return <GenericResultView result={result} title={title ?? t('defaultTitle')} />
  }
}
