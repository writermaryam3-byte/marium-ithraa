'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { SubmitButton } from '@/components/shared/forms/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { changePasswordClient } from '@/features/auth/api'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/account/schemas/password.schema'
import { ApiError } from '@/lib/errors/ApiError'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

export function ChangePasswordForm() {
  const t = useTranslations('account')
  const tValidation = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true)

    try {
      await changePasswordClient(values.currentPassword, values.newPassword)
      showSuccessToast({ raw: t('passwordChanged') })
      form.reset()
      await signOut({ callbackUrl: '/auth/login' })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH.PASSWORD_INCORRECT') {
          showErrorToast({ raw: t('currentPasswordIncorrect') })
        } else if (error.code === 'AUTH.PASSWORD_SAME') {
          showErrorToast({ raw: t('passwordSame') })
        } else {
          showErrorToast({ raw: t('passwordChangeFailed') })
        }
      } else {
        showErrorToast({ raw: t('passwordChangeFailed') })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-3xl border-amber-50/70 shadow-sm">
      <CardHeader>
        <CardTitle>{t('changePasswordTitle')}</CardTitle>
        <CardDescription>{t('changePasswordDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('currentPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      autoComplete="current-password"
                      placeholder={t('currentPasswordPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.currentPassword?.message
                      ? tValidation(form.formState.errors.currentPassword.message)
                      : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
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
                    {form.formState.errors.newPassword?.message
                      ? tValidation(form.formState.errors.newPassword.message)
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

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SubmitButton
                variant="gradient"
                className="rounded-xl"
                loading={isSubmitting}
                loadingText={t('saving')}
              >
                {t('savePassword')}
              </SubmitButton>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => form.reset()}>
                {t('cancel')}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">{t('logoutAfterChange')}</p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
