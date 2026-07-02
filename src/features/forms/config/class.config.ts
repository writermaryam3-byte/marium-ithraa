import { InputTypes } from '@/lib/types/enums'

import { createClassSchema } from '../schemas/class.schema'
import type { FormRegistryEntry } from '../types'

export const classFormConfig: FormRegistryEntry<typeof createClassSchema> = {
  schema: createClassSchema,
  defaultValues: { name: '', gradeId: '', teacherId: '' },
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Class.name.label',
      placeholderKey: 'Class.name.placeholder',
      autoFocus: true,
    },
  ],
}
