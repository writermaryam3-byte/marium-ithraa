import { InputTypes } from '@/lib/types/enums'

import { updateGradeSchema } from '../schemas/grade.schema'
import type { FormRegistryEntry } from '../types'

export const gradeUpdateFormConfig: FormRegistryEntry<typeof updateGradeSchema> = {
  schema: updateGradeSchema,
  defaultValues: { id: '', name: '' },
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Grade.name.label',
      placeholderKey: 'Grade.name.placeholder',
      autoFocus: true,
    },
  ],
}
