'use client'

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
  const validOptions = options.filter((opt): opt is { id: string; text: string } => Boolean(opt.id))
  const invalidOptions = options.filter((opt) => !opt.id)

  return (
    <div className="space-y-2">
      {invalidOptions.length > 0 && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 p-2">
          {invalidOptions.length} answer option(s) are missing an ID and cannot be selected. Contact
          support or reload the evaluation form.
        </p>
      )}
      <RadioGroup
        value={value ?? ''}
        onValueChange={onChange}
        aria-label="Answer options"
        className="gap-2"
      >
        {validOptions.map((opt) => {
          const inputId = `${questionId}-${opt.id}`
          return (
            <div
              key={opt.id}
              className={cn(
                'flex flex-row-reverse items-start gap-3 rounded-md border p-3 transition-colors',
                disabled ? 'opacity-70' : 'hover:bg-accent/40',
              )}
            >
              <RadioGroupItem id={inputId} value={opt.id} disabled={disabled} />
              <Label
                htmlFor={inputId}
                className={cn('leading-5', disabled && 'cursor-not-allowed')}
              >
                {opt.text}
              </Label>
            </div>
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
                {opt.text} <span className="text-destructive text-xs">(unavailable)</span>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
