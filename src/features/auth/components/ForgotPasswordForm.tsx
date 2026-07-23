'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SubmitButton } from '@/components/shared/forms/SubmitButton'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/account/schemas/password.schema'
import { forgotPasswordClient } from '@/features/auth/api'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { useFormConfig } from '@/features/forms'
import { useRouter } from '@/i18n/navigation'
import { FormTypes } from '@/lib/types/enums'
import { showSuccessToast } from '@/lib/toast/app-toast'

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword')
  const router = useRouter()
  const { fields } = useFormConfig(FormTypes.SIGNIN)
  const phoneFields = useMemo(() => fields.filter((field) => field.name === 'phone'), [fields])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: '' },
    mode: 'onTouched',
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null)
    setIsSubmitting(true)

    try {
      await forgotPasswordClient(values.phone.trim())
      setSent(true)
      showSuccessToast({ raw: t('success') })
    } catch {
      setError(t('errors.unexpected'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
          {t('successDetail')}
        </div>
        <Button
          type="button"
          variant="gradient"
          className="h-11 w-full rounded-xl"
          onClick={() => router.push('/auth/login')}
        >
          {t('backToLogin')}
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-sm text-muted-foreground">{t('description')}</p>

        <div className="space-y-4">
          <RhfFormFields fields={phoneFields} />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <SubmitButton
          variant="gradient"
          className="h-11 w-full rounded-xl"
          loading={isSubmitting}
          loadingText={t('submitting')}
        >
          {t('submit')}
        </SubmitButton>

        <div className="text-center text-sm text-muted-foreground">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={() => router.push('/auth/login')}
          >
            {t('backToLogin')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
