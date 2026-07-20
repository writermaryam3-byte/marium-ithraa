import { InputTypes } from '@/lib/types/enums'

import { loginDefaultValues, loginSchema, type LoginFormValues } from '../schemas/login.schema'
import type { FormRegistryEntry } from '../types'

export const loginFormConfig: FormRegistryEntry<typeof loginSchema> = {
  schema: loginSchema,
  defaultValues: loginDefaultValues,
  fields: [
    {
      name: 'phone',
      type: InputTypes.TEL,
      labelKey: 'login.phone.label',
      placeholderKey: 'login.phone.placeholder',
      autoFocus: true,
    },
    {
      name: 'password',
      type: InputTypes.PASSWORD,
      labelKey: 'login.password.label',
      placeholderKey: 'login.password.placeholder',
    },
  ],
}

export type { LoginFormValues }
