'use client'

import { useFormField } from '@/components/ui/form'
import { useTranslations } from 'next-intl'

function translateValidationMessage(
  message: string,
  tForms: ReturnType<typeof useTranslations>,
): string {
  if (message.startsWith('validation.') || message.startsWith('errors.')) {
    try {
      const translated = tForms(message as 'validation.nameRequired')
      if (translated !== message) return translated
    } catch {
      // fall through
    }
  }
  return message
}

export function TranslatedFormMessage() {
  const { error, formMessageId } = useFormField()
  const tForms = useTranslations('forms')
  const body = error ? translateValidationMessage(String(error.message ?? ''), tForms) : null

  if (!body) return null

  return (
    <p id={formMessageId} className="text-sm font-medium text-destructive">
      {body}
    </p>
  )
}
