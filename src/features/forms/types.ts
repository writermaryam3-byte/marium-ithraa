import type { z } from 'zod'

import type { InputTypes } from '@/lib/types/enums'
import type { SelectData } from '@/lib/types/types'

export type FieldConfig = {
  name: string
  type: InputTypes | `${InputTypes}`
  labelKey: string
  placeholderKey?: string
  autoFocus?: boolean
  disabled?: boolean
  data?: SelectData[]
}

export type FormRegistryEntry<TSchema extends z.ZodType = z.ZodType> = {
  fields: FieldConfig[]
  schema: TSchema
  defaultValues: z.input<TSchema>
}
