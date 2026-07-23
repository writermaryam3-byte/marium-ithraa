'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { SubmitButton } from '@/components/shared/forms/SubmitButton'
import { resetPasswordClient } from '@/features/auth/api'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/account/schemas/password.schema'
import { useRouter } from '@/i18n/navigation'
import { showSuccessToast } from '@/lib/toast/app-toast'

type Props = {
  token: string
}

export function ResetPasswordForm({ token }: Props) {
  const t = useTranslations('auth.resetPassword')
  const tValidation = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(null)
    setIsSubmitting(true)

    try {
      await resetPasswordClient(token, values.password)
      showSuccessToast({ raw: t('success') })
      router.push('/auth/login')
    } catch {
      setError(t('errors.invalidToken'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-sm text-muted-foreground">{t('description')}</p>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newPassword')}</FormLabel>
              <FormControl>
                <PasswordInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="new-password"
                  placeholder={t('newPasswordPlaceholder')}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message
                  ? tValidation(form.formState.errors.password.message)
                  : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirmPassword')}</FormLabel>
              <FormControl>
                <PasswordInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="new-password"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.confirmPassword?.message
                  ? tValidation(form.formState.errors.confirmPassword.message)
                  : null}
              </FormMessage>
            </FormItem>
          )}
        />

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
      </form>
    </Form>
  )
}
