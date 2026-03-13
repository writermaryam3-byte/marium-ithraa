import { z } from "zod"

type TranslateFn = (key: string) => string

export const createBeneficiaryOrganizationSchema = (t: TranslateFn) =>
  z.object({
    account_type: z.enum(["teacher", "parent", "organization"]),
    name: z
      .string()
      .min(2, t("name.min"))
      .max(50, t("name.max")),
    email: z.string().email(t("email.invalid")),
    password: z
      .string()
      .min(8, t("password.min"))
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
        t("password.pattern")
      ),
    phone: z.string().min(6, t("phone.min")),
    organization_name: z.string().min(2, t("organization_name.min")),
    organization_type: z
      .enum(["center", "nursery", "training", "school"])
      .or(z.undefined())
      .superRefine((val, ctx) => {
        if (!val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("organization_type.required"),
          })
        }
      }),
  })

export type BeneficiaryOrganizationSchema = z.infer<
  ReturnType<typeof createBeneficiaryOrganizationSchema>
>