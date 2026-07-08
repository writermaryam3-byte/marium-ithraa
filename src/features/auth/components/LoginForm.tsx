'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SubmitButton } from '@/components/shared/forms/SubmitButton'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginFormConfig } from '@/features/forms/config/login.config'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { useFormConfig } from '@/features/forms'
import { loginSchema, type LoginFormValues } from '@/features/forms/schemas/login.schema'
import { useRouter } from '@/i18n/navigation'
import { signInWithPhoneAndRedirect } from '@/lib/auth/signInWithCredentials'
import { FormTypes } from '@/lib/types/enums'
import { showSuccessToast } from '@/lib/toast/app-toast'

const LoginForm = () => {
  const t = useTranslations('auth.login')
  const locale = useLocale()
  const router = useRouter()
  const { login } = useAuth()
  const { fields } = useFormConfig(FormTypes.SIGNIN)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginFormConfig.defaultValues,
    mode: 'onTouched',
  })

  const onSubmit = async (values: LoginFormValues) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await signInWithPhoneAndRedirect({
        phone: values.phone.trim(),
        password: values.password,
        push: router.push,
        login,
        locale,
      })

      if (!res.ok) {
        setError(t('errors.invalidCredentials'))
        return
      }

      showSuccessToast(t, 'success')
    } catch {
      setError(t('errors.unexpected'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <RhfFormFields fields={fields} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 rounded border-input"
            />
            {t('rememberMe')}
          </label>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => router.push(`/auth/forgot-password`)}
          >
            {t('forgotPassword')}
          </Button>
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
          {t('noAccount')}{' '}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={() => router.push(`/auth/Beneficiarysignup`)}
          >
            {t('createAccount')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
