import { z } from 'zod'

import { idSchema } from './common.schema'

export const createGradeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  organizationId: z.string().min(1, 'Organization is required'),
})

export const updateGradeSchema = z.object({
  id: idSchema.shape.id,
  name: z.string().min(1, 'Name is required'),
})

export type CreateGradeFormValues = z.infer<typeof createGradeSchema>
export type UpdateGradeFormValues = z.infer<typeof updateGradeSchema>
