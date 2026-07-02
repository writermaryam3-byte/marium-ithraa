import { z } from 'zod'

type TranslateFn = (key: string) => string

const phonePattern = /^\+?[0-9\s\-()]{8,20}$/

export const createBeneficiaryOrganizationSchema = (t: TranslateFn) =>
  z
    .object({
      accountType: z.enum(['teacher', 'parent', 'organization', 'enricher']),
      name: z.string().trim().min(2, t('name.min')).max(50, t('name.max')),
      email: z.string().trim().email(t('email.invalid')),
      password: z
        .string()
        .min(8, t('password.min'))
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, t('password.pattern')),
      phone: z.string().trim().min(8, t('phone.min')).regex(phonePattern, t('phone.invalid')),
      organizationName: z
        .string()
        .trim()
        .max(120, t('organization_name.max'))
        .optional()
        .default(''),
      organizationType: z
        .union([z.enum(['center', 'nursery', 'training', 'school']), z.literal('')])
        .optional()
        .default(''),
    })
    .superRefine((data, ctx) => {
      if (
        (data.accountType === 'organization' || data.accountType === 'enricher') &&
        !data.organizationName
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('organization_name.min'),
          path: ['organizationName'],
        })
      }
      if (data.accountType === 'organization' && !data.organizationType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('organization_type.required'),
          path: ['organizationType'],
        })
      }
    })

export type BeneficiaryOrganizationFormValues = z.input<
  ReturnType<typeof createBeneficiaryOrganizationSchema>
>

export type BeneficiaryOrganizationSchema = z.output<
  ReturnType<typeof createBeneficiaryOrganizationSchema>
>
