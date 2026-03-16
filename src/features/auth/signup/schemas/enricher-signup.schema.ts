import { z } from "zod"
import { AccountType } from "@/lib/types/enums"

export const EnricherSignupSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير")
    .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم")
    .regex(/[^A-Za-z0-9]/, "كلمة المرور يجب أن تحتوي على رمز"),
  phone: z
    .string()
    .min(8, "رقم الهاتف مطلوب")
    .regex(/^\+?[0-9]{8,15}$/, "رقم الهاتف غير صحيح"),
  accountType: z.nativeEnum(AccountType),
  organizationName: z.string().min(2, "اسم المؤسسة مطلوب"),
})

export type EnricherSignupValues = z.infer<typeof EnricherSignupSchema>
