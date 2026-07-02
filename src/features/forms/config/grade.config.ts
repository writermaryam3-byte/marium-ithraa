import { InputTypes } from '@/lib/types/enums'

import { createGradeSchema } from '../schemas/grade.schema'
import type { FormRegistryEntry } from '../types'

export const gradeFormConfig: FormRegistryEntry<typeof createGradeSchema> = {
  schema: createGradeSchema,
  defaultValues: { name: '', organizationId: '' },
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
