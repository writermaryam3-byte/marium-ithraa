import { z } from 'zod'

import { passwordSchema, phoneSchema } from './common.schema'

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const loginDefaultValues: LoginFormValues = {
  phone: '',
  password: '',
}
