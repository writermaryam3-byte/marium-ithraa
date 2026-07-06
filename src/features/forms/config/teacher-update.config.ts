import { InputTypes } from '@/lib/types/enums'

import { updateTeacherSchema } from '../schemas/teacher.schema'
import type { FormRegistryEntry } from '../types'

export const teacherUpdateFormConfig: FormRegistryEntry<typeof updateTeacherSchema> = {
  schema: updateTeacherSchema,
  defaultValues: { id: '', name: '', email: '', phone: '', jobTitle: '' },
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Teacher.name.label',
      placeholderKey: 'Teacher.name.placeholder',
      autoFocus: true,
    },
    {
      name: 'email',
      type: InputTypes.EMAIL,
      labelKey: 'Teacher.email.label',
      placeholderKey: 'Teacher.email.placeholder',
    },
    {
      name: 'phone',
      type: InputTypes.TEL,
      labelKey: 'Teacher.phone.label',
      placeholderKey: 'Teacher.phone.placeholder',
    },
    {
      name: 'jobTitle',
      type: InputTypes.TEXT,
      labelKey: 'Teacher.jobTitle.label',
      placeholderKey: 'Teacher.jobTitle.placeholder',
    },
  ],
}
