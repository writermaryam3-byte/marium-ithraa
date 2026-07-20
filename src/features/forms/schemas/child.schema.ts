import { z } from 'zod'

import { Gender } from '@/lib/types/enums'

import { birthDateSchema } from './birthDate.schema'
import { nameSchema } from './common.schema'
import { idSchema } from './common.schema'

const genderSchema = z.enum([Gender.MALE, Gender.FEMALE])

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

export type CreatePrivateChildFormValues = z.infer<typeof createPrivateChildSchema>
export type UpdateChildFormValues = z.infer<typeof updateChildSchema>
