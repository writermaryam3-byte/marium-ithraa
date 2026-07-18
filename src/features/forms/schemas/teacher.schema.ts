import { z } from 'zod'

import { emailSchema, nameSchema, passwordSchema, phoneSchema } from './common.schema'
import { idSchema } from './common.schema'

export const createTeacherSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  jobTitle: z.string().min(1, 'validation.jobTitleRequired'),
})

export const updateTeacherSchema = z.object({
  id: idSchema.shape.id,
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  jobTitle: z.string().min(1, 'validation.jobTitleRequired').optional(),
})

export const deleteTeacherSchema = idSchema

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>
export type UpdateTeacherFormValues = z.infer<typeof updateTeacherSchema>

export const createTeacherDefaultValues: CreateTeacherFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  jobTitle: '',
}
