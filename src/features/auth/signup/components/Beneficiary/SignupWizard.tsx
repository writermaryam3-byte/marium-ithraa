'use client'

import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/shared/forms/SubmitButton'

import BeneficiarySignupTypeStep from './BeneficiarySignupTypeStep'
import OrganizationSignupForm from './OrganizationSignupForm'
import ParentSignupForm from './ParentSignupForm'
import TeacherSignupForm from './TeacherSignupForm'
import EnricherSignupForm from './EnricherSignupForm'
import {
  type BeneficiaryOrganizationFormValues,
  createBeneficiaryOrganizationSchema,
} from '../../schemas/signup.schema'
import {
  beneficiariesSignupClient,
  enrichersSignupClient,
  parentSignupClient,
} from '@/features/auth/api'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ApiError } from '@/lib/errors/ApiError'
import { signInWithPhoneAndRedirect } from '@/lib/auth/signInWithCredentials'
import { useLocale } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

export function SignupWizard() {
  const t = useTranslations('Signup.Beneficiary.Wizard')
  const tSignup = useTranslations('Signup')
  const router = useRouter()
  const locale = useLocale()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = useMemo(
    () => createBeneficiaryOrganizationSchema((key) => tSignup(`Beneficiary.Validation.${key}`)),
    [tSignup]
  )

  const form = useForm<BeneficiaryOrganizationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: 'organization',
      name: '',
      email: '',
      password: '',
      phone: '',
      organizationName: '',
      organizationType: '',
    },
    mode: 'onTouched',
  })

  const type = useWatch({
    control: form.control,
    name: 'accountType',
  })

  function next() {
    setSubmitError(null)
    setStep((s) => s + 1)
  }

  function back() {
    setSubmitError(null)
    setStep((s) => s - 1)
  }

  async function onSubmit(values: BeneficiaryOrganizationFormValues) {
    setSubmitError(null)

    try {
      setIsSubmitting(true)

      const basePayload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim(),
      }

      let response: { message?: string }

      if (values.accountType === 'parent') {
        response = await parentSignupClient(basePayload)
      } else if (values.accountType === 'enricher') {
        response = await enrichersSignupClient({
          ...basePayload,
          accountType: values.accountType,
          organizationName: values.organizationName?.trim() || '',
        })
      } else {
        response = await beneficiariesSignupClient({
          ...basePayload,
          accountType: values.accountType,
          organizationName: values.organizationName?.trim() || '',
          organizationType: values.organizationType || '',
        })
      }

      const isPendingApproval =
        values.accountType === 'organization' || values.accountType === 'enricher'

      showSuccessToast({
        raw: isPendingApproval ? t('organizationPendingSuccess') : response.message || t('success'),
      })

      const loginResult = await signInWithPhoneAndRedirect({
        phone: values.phone,
        password: values.password,
        push: router.push,
        login,
        locale,
      })

      if (!loginResult.ok) {
        const message = t('autoLoginFailed')
        setSubmitError(message)
        showErrorToast({ raw: message })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('unableToCreate')

      setSubmitError(message)
      showErrorToast({ raw: message })

      if (error instanceof ApiError) {
        Object.entries(error.validationErrors ?? {}).forEach(([name, messages]) => {
          const firstMessage = messages[0]
          if (!firstMessage) return

          form.setError(name as keyof BeneficiaryOrganizationFormValues, {
            message: firstMessage,
          })
        })
      }
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
                {type === 'teacher' && <TeacherSignupForm />}
                {type === 'parent' && <ParentSignupForm />}
                {type === 'organization' && <OrganizationSignupForm />}
                {type === 'enricher' && <EnricherSignupForm />}
              </div>
            )}

            {submitError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={back} disabled={isSubmitting}>
                  {t('back')}
                </Button>
              )}
              <div className="ms-auto">
                <SubmitButton
                  loading={isSubmitting}
                  loadingText={step === 1 ? undefined : t('submitting')}
                >
                  {step === 1 ? t('next') : t('submit')}
                </SubmitButton>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
