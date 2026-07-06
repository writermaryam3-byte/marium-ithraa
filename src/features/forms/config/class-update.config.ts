import { InputTypes } from '@/lib/types/enums'

import { updateClassSchema } from '../schemas/class.schema'
import type { FormRegistryEntry } from '../types'

export const classUpdateFormConfig: FormRegistryEntry<typeof updateClassSchema> = {
  schema: updateClassSchema,
  defaultValues: { id: '', name: '', gradeId: '', teacherId: '' },
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
