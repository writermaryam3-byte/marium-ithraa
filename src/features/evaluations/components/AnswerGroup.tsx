'use client'

import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

export type AnswerOptionInput = {
  id?: string
  text: string
}

export default function AnswerGroup({
  questionId,
  options,
  value,
  onChange,
  disabled,
}: {
  questionId: string
  options: AnswerOptionInput[]
  value: string | undefined
  onChange: (selectedAnswerId: string) => void
  disabled?: boolean
}) {
  const t = useTranslations('evaluations.answerGroup')
  const validOptions = options.filter((opt): opt is { id: string; text: string } => Boolean(opt.id))
  const invalidOptions = options.filter((opt) => !opt.id)

  return (
    <div className="space-y-2">
      {invalidOptions.length > 0 && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 p-2">
          {t('missingIds', { count: invalidOptions.length })}
        </p>
      )}
      <RadioGroup
        value={value ?? ''}
        onValueChange={onChange}
        aria-label={t('ariaLabel')}
        className="gap-2"
      >
        {validOptions.map((opt) => {
          const inputId = `${questionId}-${opt.id}`
          const selected = value === opt.id
          return (
            <Label
              key={opt.id}
              htmlFor={inputId}
              className={cn(
                'flex flex-row-reverse items-start gap-3 rounded-md border p-3 transition-colors',
                disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-accent/40',
                selected && !disabled && 'border-primary bg-primary/5',
              )}
            >
              <RadioGroupItem id={inputId} value={opt.id} disabled={disabled} />
              <span className={cn('leading-5', disabled && 'cursor-not-allowed')}>{opt.text}</span>
            </Label>
          )
        })}
        {invalidOptions.map((opt, idx) => {
          const inputId = `${questionId}-invalid-${idx}`
          return (
            <div
              key={inputId}
              className="flex items-start gap-3 rounded-md border border-dashed border-destructive/40 p-3 opacity-60"
            >
              <RadioGroupItem id={inputId} value="" disabled />
              <Label htmlFor={inputId} className="leading-5 cursor-not-allowed">
                {opt.text}{' '}
                <span className="text-destructive text-xs">({t('unavailable')})</span>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
