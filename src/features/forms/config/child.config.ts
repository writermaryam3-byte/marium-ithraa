import { Gender, InputTypes } from '@/lib/types/enums'

import { createPrivateChildSchema, updateChildSchema } from '../schemas/child.schema'
import type { FormRegistryEntry } from '../types'

export const childUpdateFormConfig: FormRegistryEntry<typeof updateChildSchema> = {
  schema: updateChildSchema,
  defaultValues: { id: '', name: '', birthDate: '', gender: Gender.MALE },
  fields: [
    { name: 'name', type: InputTypes.TEXT, labelKey: 'Child.name.label', autoFocus: true },
    { name: 'birthDate', type: InputTypes.DATE, labelKey: 'Child.birthDate.label' },
  ],
}

export const childPrivateFormConfig: FormRegistryEntry<typeof createPrivateChildSchema> = {
  schema: createPrivateChildSchema,
  defaultValues: { name: '', birthDate: '', gender: Gender.MALE, currentCount: 0 },
  fields: [
    { name: 'name', type: InputTypes.TEXT, labelKey: 'Child.name.label', autoFocus: true },
    { name: 'birthDate', type: InputTypes.DATE, labelKey: 'Child.birthDate.label' },
  ],
}
