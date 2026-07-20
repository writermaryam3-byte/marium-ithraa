import { z } from 'zod'

export type {
  AttemptAnswerPayload,
  AvailableEvaluationsResponse,
  ChildReference,
  ChildType,
  CreateEvaluationDimensionPayload,
  CreateEvaluationPayload,
  CreateEvaluationQuestionAnswerPayload,
  CreateEvaluationQuestionPayload,
  Evaluation,
  EvaluationAnswer,
  EvaluationAttempt,
  EvaluationAttemptStatus,
  EvaluationDimension,
  EvaluationQuestion,
  EvaluationQuestionAnswer,
  EvaluationType,
  SaveAttemptProgressPayload,
  StartEvaluationPayload,
  SubmitAttemptPayload,
} from '@/lib/types/interfaces'

export const evaluationTypeSchema = z.enum([
  'multiple_intelligences',
  'pride',
  'renzulli',
  'holland',
  'learning_styles',
  'torrance',
  'preschool_giftedness',
])

export const uuidSchema = z.string().uuid()

export const attemptAnswerSchema = z.object({
  questionId: uuidSchema,
  selectedAnswerId: uuidSchema,
})

export const saveAttemptSchema = z.object({
  answers: z.array(attemptAnswerSchema).optional(),
})

export const submitAttemptSchema = z.object({
  answers: z.array(attemptAnswerSchema).min(1),
})

export const startAttemptSchema = z.object({
  childId: uuidSchema,
  childType: z.enum(['organization', 'private']),
  expiresInSeconds: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
})

const dimensionSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  minScore: z.number(),
  maxScore: z.number(),
  interpretationRules: z.record(z.string(), z.unknown()).nullable().optional(),
})

const questionAnswerSchema = z.object({
  text: z.string().min(1),
  scoreValue: z.number(),
  code: z.string().nullable().optional(),
})

const questionSchema = z.object({
  content: z.string().min(1),
  dimensionCode: z.string().min(1),
  order: z.number().int().optional(),
  answers: z.array(questionAnswerSchema).min(2),
})

export const createEvaluationSchema = z
  .object({
    title: z.string().min(1),
    type: evaluationTypeSchema,
    institutionId: uuidSchema,
    ageFrom: z.number().int().min(0).nullable().optional(),
    ageTo: z.number().int().min(0).nullable().optional(),
    evaluatorTypes: z.array(z.string()).optional(),
    dimensions: z.array(dimensionSchema).min(1),
    questions: z.array(questionSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const codes = data.dimensions.map((d) => d.code)
    const unique = new Set(codes)
    if (unique.size !== codes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate dimension codes are not allowed',
        path: ['dimensions'],
      })
    }

    for (const dim of data.dimensions) {
      if (dim.maxScore < dim.minScore) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'maxScore must be greater than or equal to minScore',
          path: ['dimensions'],
        })
      }
    }

    if (data.ageFrom != null && data.ageTo != null && data.ageTo < data.ageFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ageTo must be greater than or equal to ageFrom',
        path: ['ageTo'],
      })
    }

    const codeSet = new Set(codes)
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]
      if (!codeSet.has(q.dimensionCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown dimensionCode: ${q.dimensionCode}`,
          path: ['questions', i, 'dimensionCode'],
        })
      }
    }
  })

export type CreateEvaluationDto = z.infer<typeof createEvaluationSchema>
export type StartAttemptDto = z.infer<typeof startAttemptSchema>
export type SaveAttemptDto = z.infer<typeof saveAttemptSchema>
export type SubmitAttemptDto = z.infer<typeof submitAttemptSchema>

/** @deprecated Use EvaluationAttempt */
export type Attempt = import('@/lib/types/interfaces').EvaluationAttempt
