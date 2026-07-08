'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Evaluation } from '@/features/evaluations/types'
import { formatAgeRange, getEvaluationTypeLabel } from '@/features/evaluations/utils/labels'
import { getTextDirection } from '@/lib/i18n/locale-utils'

type Props = {
  evaluation: Evaluation
}

export function AdminEvaluationDetailsScreen({ evaluation }: Props) {
  const locale = useLocale()
  const t = useTranslations('evaluations')

  const groupedQuestions = useMemo(() => {
    const map = new Map<string, typeof evaluation.questions>()
    for (const q of evaluation.questions ?? []) {
      const code = q.dimension?.code ?? q.evaluationDimension?.code ?? 'unknown'
      const list = map.get(code) ?? []
      list.push(q)
      map.set(code, list)
    }
    return map
  }, [evaluation])

  return (
    <div className="space-y-6 px-4 lg:px-6" dir={getTextDirection(locale)}>
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {t('adminScoreWarning')}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{t('detailsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">{t('title')}: </span>
            {evaluation.title}
          </p>
          <p>
            <span className="text-muted-foreground">{t('type')}: </span>
            <Badge variant="secondary">{getEvaluationTypeLabel(evaluation.type, t)}</Badge>
          </p>
          <p>
            <span className="text-muted-foreground">{t('ageRange')}: </span>
            {formatAgeRange(evaluation.ageFrom, evaluation.ageTo, t)}
          </p>
          <p>
            <span className="text-muted-foreground">{t('evaluatorTypes')}: </span>
            {evaluation.evaluatorTypes?.join(', ') || '—'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('dimensions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(evaluation.dimensions ?? []).map((dim) => (
            <div key={dim.code} className="rounded-lg border p-4 space-y-2">
              <p className="font-medium">
                {dim.name} ({dim.code})
              </p>
              <p className="text-sm text-muted-foreground">
                {t('scoreRange')}: {dim.minScore} – {dim.maxScore}
              </p>
              {dim.interpretationRules && (
                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(dim.interpretationRules, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('questions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from(groupedQuestions.entries()).map(([code, questions]) => (
            <div key={code} className="space-y-4">
              <h3 className="font-semibold">{code}</h3>
              {questions
                ?.sort((a, b) => a.order - b.order)
                .map((q, idx) => (
                  <div key={q.id} className="rounded-lg border p-4 space-y-3">
                    <p className="font-medium">
                      {idx + 1}. {q.content}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {q.answers.map((a) => (
                        <li
                          key={a.id}
                          className="flex justify-between gap-4 border-b pb-2 last:border-0"
                        >
                          <span>{a.text}</span>
                          <span className="text-muted-foreground shrink-0">
                            {t('scoreValue')}: {a.scoreValue ?? '—'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
