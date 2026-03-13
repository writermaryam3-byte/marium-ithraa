"use client"

import { Control, Controller } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export default function BeneficiarySignupTypeStep({ control }: Props) {
  const locale = useLocale()
  const t = useTranslations("Signup.Beneficiary.TypeStep")
  const isRtl = locale === "ar"

  return (
    <div className={cn("space-y-6", isRtl ? "text-right" : "text-left")}>
      <div>
        <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <Controller
        name="account_type"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-3 sm:grid-cols-3"
          >
            {["organization", "parent", "teacher"].map((value) => (
              <FieldLabel key={value} htmlFor={value}>
                <Field orientation="vertical" className="rounded-2xl border border-border/60 bg-secondary/40 px-3 py-3 shadow-sm hover:border-primary/50">
                  <FieldContent>
                    <FieldTitle className="text-base font-semibold text-foreground">
                      {t(`options.${value}.title`)}
                    </FieldTitle>
                    <FieldDescription className="mt-1 text-xs sm:text-sm">
                      {t(`options.${value}.description`)}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={value} id={value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  )
}