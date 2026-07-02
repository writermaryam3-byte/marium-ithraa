import { InputTypes } from '@/lib/types/enums'

import { updateEmployeeSchema } from '../schemas/employee.schema'
import type { FormRegistryEntry } from '../types'

export const employeeUpdateFormConfig: FormRegistryEntry<typeof updateEmployeeSchema> = {
  schema: updateEmployeeSchema,
  defaultValues: { id: '', name: '', job_title: '' },
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Employee.name.label',
      placeholderKey: 'Employee.name.placeholder',
      autoFocus: true,
    },
    {
      name: 'job_title',
      type: InputTypes.TEXT,
      labelKey: 'Employee.jobTitle.label',
      placeholderKey: 'Employee.jobTitle.placeholder',
    },
  ],
}
