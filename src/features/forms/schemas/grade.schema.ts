import { z } from 'zod'

import { idSchema } from './common.schema'

export const createGradeSchema = z.object({
  name: z.string().min(1, 'validation.nameRequired'),
  organizationId: z.string().min(1, 'validation.organizationRequired'),
})

export const updateGradeSchema = z.object({
  id: idSchema.shape.id,
  name: z.string().min(1, 'validation.nameRequired'),
})

export type CreateGradeFormValues = z.infer<typeof createGradeSchema>
export type UpdateGradeFormValues = z.infer<typeof updateGradeSchema>
