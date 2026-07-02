import { z } from 'zod'

const answerInputSchema = z.object({
  text: z.string().min(1),
  score: z.coerce.number(),
})

const answerWizardSchema = z.object({
  text: z.string().min(1),
  score: z.number(),
})

const questionInputSchema = z.object({
  content: z.string().min(1),
  answers: z.array(answerInputSchema).min(1),
})

const questionWizardSchema = z.object({
  content: z.string().min(1),
  answers: z.array(answerWizardSchema).min(1),
})

export const createTestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  questions: z
    .string()
    .min(2)
    .transform((raw, ctx) => {
      try {
        const parsed = JSON.parse(raw) as unknown
        const result = z.array(questionInputSchema).min(1).safeParse(parsed)
        if (!result.success) {
          ctx.addIssue({ code: 'custom', message: 'Invalid questions payload' })
          return z.NEVER
        }
        return result.data
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Invalid questions JSON' })
        return z.NEVER
      }
    }),
})

export type CreateTestFormInput = z.input<typeof createTestSchema>
export type CreateTestFormValues = z.output<typeof createTestSchema>

export const createTestDefaultValues: CreateTestFormInput = {
  title: '',
  description: '',
  questions: '[]',
}

export const testWizardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(questionWizardSchema).min(1),
})

export type TestWizardFormValues = z.infer<typeof testWizardSchema>

export const testWizardDefaultValues: TestWizardFormValues = {
  title: '',
  description: '',
  questions: [{ content: '', answers: [{ text: '', score: 0 }] }],
}
