import { z } from 'zod'

import { Gender } from '@/lib/types/enums'

import { birthDateSchema } from './birthDate.schema'
import { emailSchema, nameSchema, passwordSchema, phoneSchema } from './common.schema'
import { idSchema } from './common.schema'

const genderSchema = z.enum([Gender.MALE, Gender.FEMALE])

export const createOrgChildSchema = z.object({
  organizationId: z.string().min(1),
  name: nameSchema,
  birthDate: birthDateSchema,
  gender: genderSchema,
  classId: z.string().min(1, 'Class is required'),
  parentName: nameSchema,
  parentEmail: emailSchema,
  parentPhone: phoneSchema,
  parentPassword: passwordSchema,
})

export const createAdminChildSchema = z.object({
  user_id: z.string().min(1),
  name: nameSchema,
  grade: z.string().optional(),
  birthDate: birthDateSchema,
  gender: genderSchema,
})

export const createPrivateChildSchema = z.object({
  name: nameSchema,
  birthDate: birthDateSchema,
  gender: genderSchema,
  currentCount: z.coerce.number().int().min(0).optional(),
})

export const updateChildSchema = z.object({
  id: idSchema.shape.id,
  name: z.string().min(1).optional(),
  birthDate: z.string().optional(),
  gender: genderSchema.optional(),
  classId: z.string().optional(),
})

export type CreateOrgChildFormValues = z.infer<typeof createOrgChildSchema>
export type CreateAdminChildFormValues = z.infer<typeof createAdminChildSchema>
export type CreatePrivateChildFormValues = z.infer<typeof createPrivateChildSchema>
export type UpdateChildFormValues = z.infer<typeof updateChildSchema>
