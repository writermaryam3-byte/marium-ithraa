import { z } from 'zod'

import { emailSchema, nameSchema, passwordSchema, phoneSchema } from './common.schema'
import { idSchema } from './common.schema'

export const createEmployeeSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  job_title: z.string().min(1, 'Job title is required'),
  organization_id: z.string().min(1, 'Organization is required'),
})

export const updateEmployeeSchema = z.object({
  id: idSchema.shape.id,
  name: nameSchema,
  job_title: z.string().min(1, 'Job title is required'),
})

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>

export const createEmployeeDefaultValues: CreateEmployeeFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  job_title: '',
  organization_id: '',
}
