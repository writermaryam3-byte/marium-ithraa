"use client"

import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import BeneficiarySignupTypeStep from "./BeneficiarySignupTypeStep"
import OrganizationSignupForm from "./OrganizationSignupForm"
import ParentSignupForm from "./ParentSignupForm"
import TeacherSignupForm from "./TeacherSignupForm"
import {
  BeneficiaryOrganizationSchema,
  createBeneficiaryOrganizationSchema,
} from "../../schemas/signup.schema"

export function SignupWizard() {
  const t = useTranslations("Signup.Beneficiary.Wizard")
  const tSignup = useTranslations("Signup")
  const locale = useLocale()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = useMemo(
    () =>
      createBeneficiaryOrganizationSchema((key) =>
        tSignup(`Beneficiary.Validation.${key}`)
      ),
    [tSignup]
  )

  const form = useForm<BeneficiaryOrganizationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      account_type: "organization",
      name: "",
      email: "",
      password: "",
      phone: "",
      organization_name: "",
      organization_type: undefined as unknown as BeneficiaryOrganizationSchema["organization_type"],
    },
    mode: "onTouched",
  })

  const type = useWatch({
    control: form.control,
    name: "account_type",
  })

  function next() {
    setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => s - 1)
  }

  async function onSubmit(values: BeneficiaryOrganizationSchema) {
    try {
      setIsSubmitting(true)

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

      const response = await fetch(`${apiBase}/auth/beneficiaries-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          account_type: values.account_type,
          organization_name: values.organization_name,
          organization_type: values.organization_type,
        }),
      })

      if (!response.ok) {
        console.error("Signup failed", await response.text())
        return
      }

      router.push(`/${locale}/dashboard/organization`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-container py-16 lg:py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm lg:p-8">
        <Form {...form}>
          <form
            onSubmit={
              step === 1
                ? (event) => {
                    event.preventDefault()
                    next()
                  }
                : form.handleSubmit(onSubmit)
            }
            className="space-y-8"
          >
            {step === 1 && <BeneficiarySignupTypeStep control={form.control} />}

            {step === 2 && (
              <div className="space-y-6">
                {type === "teacher" && <TeacherSignupForm />}
                {type === "parent" && <ParentSignupForm />}
                {type === "organization" && <OrganizationSignupForm />}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={back}>
                  {t("back")}
                </Button>
              )}
              <div className="ml-auto">
                <Button type="submit" disabled={isSubmitting}>
                  {step === 1 ? t("next") : t("submit")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}