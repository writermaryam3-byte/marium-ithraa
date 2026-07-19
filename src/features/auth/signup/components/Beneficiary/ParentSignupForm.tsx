'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { PhoneInputField } from '@/components/shared/forms/PhoneInputField'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from '@/components/ui/field'

const ParentSignupForm = () => {
  const t = useTranslations('signup.beneficiary.parent')
  const form = useFormContext()

  return (
    <FieldSet>
      <FieldLegend className="text-xl font-extrabold text-primary">{t('title')}</FieldLegend>
      <FieldDescription>{t('subtitle')}</FieldDescription>

      <FieldGroup>
        <Field>
          <FieldContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('fields.name.placeholder')}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.email.label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('fields.email.placeholder')}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldContent>
            <PhoneInputField
              name="phone"
              label={t('fields.phone.label')}
              placeholder={t('fields.phone.placeholder')}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldContent>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.password.label')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t('fields.password.placeholder')}
                      autoComplete="new-password"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

export default ParentSignupForm
