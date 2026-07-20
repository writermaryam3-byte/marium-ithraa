'use client'

import type { ReactNode } from 'react'
import type { DefaultValues, FieldValues } from 'react-hook-form'
import type { z } from 'zod'

import { Form } from '@/components/ui/form'
import { FormTypes } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

import { useFormConfig } from '../hooks/useFormConfig'
import { useServerActionForm } from '../hooks/useServerActionForm'
import { RhfFormFields } from './RhfFormFields'

type ServerActionFormProps<T extends FieldValues = FieldValues> = {
  formType?: FormTypes
  schema?: z.ZodType<T>
  defaultValues?: DefaultValues<T>
  action: (_prev: InitialState, formData: FormData) => Promise<InitialState>
  hiddenFields?: Record<string, string>
  onStatusChange?: (state: InitialState) => void
  children?: ReactNode
  className?: string
  fields?: ReturnType<typeof useFormConfig>['fields']
}

export function ServerActionForm<T extends FieldValues = FieldValues>({
  formType,
  schema: schemaOverride,
  defaultValues: defaultValuesOverride,
  action,
  hiddenFields = {},
  onStatusChange,
  children,
  className,
  fields: fieldsOverride,
}: ServerActionFormProps<T>) {
  const config = useFormConfig(formType ?? FormTypes.SIGNIN)
  const schema = (schemaOverride ?? config.schema) as z.ZodType<T>
  const defaultValues = (defaultValuesOverride ?? config.defaultValues) as DefaultValues<T>
  const fields = fieldsOverride ?? config.fields

  const { form, submit, isPending } = useServerActionForm<T>({
    schema,
    defaultValues,
    action,
    onStatusChange,
  })

  if (!schema) return null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => submit(values, hiddenFields))}
        className={className}
      >
        <fieldset disabled={isPending} className="space-y-5">
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" {...form.register(name as never)} defaultValue={value} />
          ))}
          <RhfFormFields fields={fields} />
          {children}
        </fieldset>
      </form>
    </Form>
  )
}
