'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AnswerGroup from './AnswerGroup'

export default function QuestionCard({
  index,
  question,
  value,
  onChange,
  disabled,
}: {
  index: number
  question: {
    id: string
    content: string
    answers: Array<{ id: string; text: string }>
  }
  value: string | undefined
  onChange: (selectedAnswerId: string) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">
          <span className="text-muted-foreground">Q{index + 1}.</span> {question.content}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnswerGroup
          questionId={question.id}
          options={question.answers}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  )
}
