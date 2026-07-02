import { z } from 'zod'

import { emailSchema, nameSchema, passwordSchema, phoneSchema } from './common.schema'
import { idSchema } from './common.schema'

export const createTeacherSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  jobTitle: z.string().min(1, 'Job title is required'),
})

export const deleteTeacherSchema = idSchema

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>

export const createTeacherDefaultValues: CreateTeacherFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  jobTitle: '',
}
