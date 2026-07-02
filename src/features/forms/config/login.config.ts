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
      labelKey: 'Login.phone.label',
      placeholderKey: 'Login.phone.placeholder',
      autoFocus: true,
    },
    {
      name: 'password',
      type: InputTypes.PASSWORD,
      labelKey: 'Login.password.label',
      placeholderKey: 'Login.password.placeholder',
    },
  ],
}

export type { LoginFormValues }
