import { z } from 'zod'

export const idSchema = z.object({
  id: z.string().min(1, 'errors.invalid_id'),
})

export const phoneSchema = z.string().min(6, 'errors.phone_required')
export const passwordSchema = z.string().min(8, 'errors.password_min')
export const emailSchema = z.email('errors.invalid_email')
export const nameSchema = z.string().min(2, 'errors.name_required')
