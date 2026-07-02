import { z } from 'zod'

import { idSchema } from './common.schema'

export const createClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  teacherId: z.string().optional(),
})

export const updateClassSchema = z.object({
  id: idSchema.shape.id,
  name: z.string().min(1).optional(),
  gradeId: z.string().min(1).optional(),
  teacherId: z.string().optional(),
})

export type CreateClassFormValues = z.infer<typeof createClassSchema>
export type UpdateClassFormValues = z.infer<typeof updateClassSchema>
