'use client'

import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/shared/forms/SubmitButton'
import { AuthPageShell } from '@/features/auth/components/AuthPageShell'
import { cn } from '@/lib/utils'

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

const TOTAL_STEPS = 2

export function SignupWizard() {
  const t = useTranslations('signup.beneficiary.wizard')
  const tValidation = useTranslations('validation')
  const router = useRouter()
  const locale = useLocale()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = useMemo(
    () => createBeneficiaryOrganizationSchema((key) => tValidation(key)),
    [tValidation],
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

      if (values.accountType === 'parent') {
        await parentSignupClient(basePayload)
      } else if (values.accountType === 'enricher') {
        await enrichersSignupClient({
          ...basePayload,
          accountType: values.accountType,
          organizationName: values.organizationName?.trim() || '',
        })
      } else {
        await beneficiariesSignupClient({
          ...basePayload,
          accountType: values.accountType,
          organizationName: values.organizationName?.trim() || '',
          organizationType: values.organizationType || '',
        })
      }

      const isPendingApproval =
        values.accountType === 'organization' || values.accountType === 'enricher'

      showSuccessToast({
        raw: isPendingApproval ? t('organizationPendingSuccess') : t('success'),
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
        for (const fe of error.fieldErrors) {
          if (!fe.message) continue

          form.setError(fe.field as keyof BeneficiaryOrganizationFormValues, {
            message: fe.message,
          })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepIndicator = (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const stepNumber = index + 1
          return (
            <div
              key={stepNumber}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                step >= stepNumber ? 'bg-primary' : 'bg-muted',
              )}
            />
          )
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t('stepLabel', { current: step, total: TOTAL_STEPS })}
      </p>
    </div>
  )

  const loginFooter = (
    <div className="border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
      {t('hasAccount')}{' '}
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 font-semibold"
        onClick={() => router.push('/auth/login')}
      >
        {t('signIn')}
      </Button>
    </div>
  )

  return (
    <AuthPageShell
      title={t('title')}
      sideTitle={t('side.title')}
      sideSubtitle={t('side.subtitle')}
      cardClassName="max-w-none"
      headerExtra={stepIndicator}
      footer={loginFooter}
    >
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
          className="space-y-6"
        >
          {step === 1 && <BeneficiarySignupTypeStep control={form.control} />}

          {step === 2 && (
            <div className="space-y-5">
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

          <div className="flex items-center justify-between gap-4 pt-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={back} disabled={isSubmitting}>
                {t('back')}
              </Button>
            ) : (
              <div />
            )}
            <SubmitButton
              variant="gradient"
              className="h-11 min-w-32 rounded-xl"
              loading={isSubmitting}
              loadingText={step === 1 ? undefined : t('submitting')}
            >
              {step === 1 ? t('next') : t('submit')}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </AuthPageShell>
  )
}
