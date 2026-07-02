import { InputTypes } from '@/lib/types/enums'

import { createEmployeeDefaultValues, createEmployeeSchema } from '../schemas/employee.schema'
import type { FormRegistryEntry } from '../types'

export const employeeFormConfig: FormRegistryEntry<typeof createEmployeeSchema> = {
  schema: createEmployeeSchema,
  defaultValues: createEmployeeDefaultValues,
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Employee.name.label',
      placeholderKey: 'Employee.name.placeholder',
      autoFocus: true,
    },
    {
      name: 'phone',
      type: InputTypes.TEL,
      labelKey: 'Employee.phone.label',
      placeholderKey: 'Employee.phone.placeholder',
    },
    {
      name: 'email',
      type: InputTypes.EMAIL,
      labelKey: 'Employee.email.label',
      placeholderKey: 'Employee.email.placeholder',
    },
    {
      name: 'password',
      type: InputTypes.PASSWORD,
      labelKey: 'Employee.password.label',
      placeholderKey: 'Employee.password.placeholder',
    },
    {
      name: 'job_title',
      type: InputTypes.TEXT,
      labelKey: 'Employee.jobTitle.label',
      placeholderKey: 'Employee.jobTitle.placeholder',
    },
  ],
}
