'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

import { FormTypes } from '@/lib/types/enums'
import type { IFormField } from '@/lib/types/interfaces'

import { formRegistry } from '../config'
import type { FieldConfig } from '../types'

function resolveFields(fields: FieldConfig[], t: (key: string) => string): IFormField[] {
  return fields.map((field) => ({
    name: field.name,
    type: field.type as IFormField['type'],
    label: t(field.labelKey),
    placeholder: field.placeholderKey ? t(field.placeholderKey) : undefined,
    autoFocus: field.autoFocus,
    disabled: field.disabled,
    data: field.data,
  }))
}

export function useFormConfig(slug: FormTypes) {
  const t = useTranslations('Forms')
  const entry = formRegistry[slug]

  return useMemo(() => {
    if (!entry) {
      return {
        fields: [] as IFormField[],
        schema: null,
        defaultValues: {},
      }
    }

    return {
      fields: resolveFields(entry.fields, t),
      schema: entry.schema,
      defaultValues: entry.defaultValues,
    }
  }, [entry, slug, t])
}

export default useFormConfig
