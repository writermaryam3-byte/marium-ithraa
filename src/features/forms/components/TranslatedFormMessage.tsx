'use client'

import { useFormField } from '@/components/ui/form'
import { useTranslations } from 'next-intl'

import { translateValidationKey } from '@/lib/i18n/validation-messages'

export function TranslatedFormMessage() {
  const { error, formMessageId } = useFormField()
  const tValidation = useTranslations('validation')
  const tErrors = useTranslations('errors')
  const tForms = useTranslations('forms')

  const body = error
    ? translateValidationKey(String(error.message ?? ''), {
        validation: tValidation,
        errors: tErrors,
        forms: tForms,
      })
    : null

  if (!body) return null

  return (
    <p id={formMessageId} className="text-sm font-medium text-destructive">
      {body}
    </p>
  )
}
