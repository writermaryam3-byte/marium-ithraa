import { z } from 'zod'

type TranslateFn = (key: string) => string

export const createRejectionReasonSchema = (t: TranslateFn) =>
  z.object({
    rejectionReason: z.string().trim().min(3, t('min')).max(500, t('max')),
  })

export type RejectionReasonFormValues = z.infer<ReturnType<typeof createRejectionReasonSchema>>
