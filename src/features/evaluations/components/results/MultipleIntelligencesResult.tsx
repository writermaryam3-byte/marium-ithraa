'use client'

import { useLocale } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import {
  getMultipleIntelligencesReportContent,
  type MiReportDimensionContent,
} from '@/features/evaluations/data/multiple-intelligences-report-content'
import { isMultipleIntelligencesCode } from '@/features/evaluations/data/multiple-intelligences-codes'
import {
  getDimensionPercentage,
  getResultDimensions,
  getTopDimensions,
} from '@/features/evaluations/utils/result-fields'

type DimScore = {
  code?: string
  name?: string
  score?: number
  percentage?: number | null
}

type Props = {
  result: Record<string, unknown>
  childName?: string
}

function DimensionDetailCard({
  rank,
  score,
  percentage,
  content,
  labels,
}: {
  rank: number
  score: number
  percentage: number
  content: MiReportDimensionContent
  labels: {
    scoreLabel: string
    definitionLabel: string
    peakAgeLabel: string
    developmentLabel: string
    careersLabel: string
  }
}) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge variant="secondary" className="mb-1">
              #{rank}
            </Badge>
            <CardTitle className="text-lg">{content.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{content.subtitle}</p>
          </div>
          <div className="text-end text-sm">
            <p className="text-muted-foreground">{labels.scoreLabel}</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
            <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</p>
          </div>
        </div>
        <ProgressBar value={percentage} className="mt-3" />
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-primary">{labels.definitionLabel}</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">{content.definition}</p>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-primary">{labels.peakAgeLabel}</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">{content.peakAge}</p>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-primary">{labels.developmentLabel}</h4>
          <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
            {content.developmentTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-primary">{labels.careersLabel}</h4>
          <div className="flex flex-wrap gap-2">
            {content.careers.map((career) => (
              <Badge key={career} variant="outline" className="font-normal">
                {career}
              </Badge>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

export function MultipleIntelligencesResult({ result, childName }: Props) {
  const locale = useLocale()
  const report = getMultipleIntelligencesReportContent(locale)
  const dimensions = getResultDimensions(result) as DimScore[]
  const top3 = getTopDimensions(result) as DimScore[]

  const labels = {
    scoreLabel: report.scoreLabel,
    definitionLabel: report.definitionLabel,
    peakAgeLabel: report.peakAgeLabel,
    developmentLabel: report.developmentLabel,
    careersLabel: report.careersLabel,
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl">{report.reportTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p className="font-semibold text-primary">{report.parentGreeting}</p>
          <p className="text-muted-foreground">{report.intro}</p>
          {childName && (
            <p className="rounded-lg border bg-background px-4 py-3 font-medium">
              {childName}
            </p>
          )}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold">{report.top3Title}</h3>
          <p className="text-sm text-muted-foreground">{report.top3Intro}</p>
        </div>
        {top3.length === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          top3.map((d, index) => {
            const code = d.code ?? ''
            if (!isMultipleIntelligencesCode(code)) return null
            const content = report.dimensions[code]
            const score = d.score ?? 0
            const pct = getDimensionPercentage(d as Record<string, unknown>)
            return (
              <DimensionDetailCard
                key={code}
                rank={index + 1}
                score={score}
                percentage={pct}
                content={content}
                labels={labels}
              />
            )
          })
        )}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{report.allDimensionsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dimensions.map((d, index) => {
            const score = d.score ?? 0
            const pct = getDimensionPercentage(d as Record<string, unknown>)
            const code = d.code ?? ''
            const title =
              isMultipleIntelligencesCode(code)
                ? report.dimensions[code].title
                : (d.name ?? code)
            return (
              <div key={d.code ?? index} className="space-y-1">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="font-medium">{title}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {score} ({pct.toFixed(0)}%)
                  </span>
                </div>
                <ProgressBar value={pct} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {report.footerNote}
      </p>
    </div>
  )
}
