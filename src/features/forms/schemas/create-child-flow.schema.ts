import { z } from 'zod'

import { birthDateSchema } from './birthDate.schema'
import { Gender } from '@/lib/types/enums'

export const createChildFlowSchema = z.object({
  parentPhone: z.string().trim().min(1, 'validation.createChild.parentPhoneRequired'),
  parentName: z.string().trim().optional(),
  parentEmail: z
    .string()
    .trim()
    .email('validation.createChild.validEmail')
    .optional()
    .or(z.literal('')),
  name: z.string().trim().min(1, 'validation.createChild.childNameRequired'),
  birthDate: birthDateSchema,
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  gradeId: z.string().min(1, 'validation.createChild.gradeRequired'),
  classId: z.string().min(1, 'validation.createChild.classRequired'),
})

export type CreateChildFlowValues = z.infer<typeof createChildFlowSchema>
