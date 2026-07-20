import { InputTypes } from '@/lib/types/enums'

import { updateTeacherSchema } from '../schemas/teacher.schema'
import type { FormRegistryEntry } from '../types'

export const teacherUpdateFormConfig: FormRegistryEntry<typeof updateTeacherSchema> = {
  schema: updateTeacherSchema,
  defaultValues: { id: '', name: '', jobTitle: '' },
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Teacher.name.label',
      placeholderKey: 'Teacher.name.placeholder',
      autoFocus: true,
    },
    {
      name: 'jobTitle',
      type: InputTypes.TEXT,
      labelKey: 'Teacher.jobTitle.label',
      placeholderKey: 'Teacher.jobTitle.placeholder',
    },
  ],
}
