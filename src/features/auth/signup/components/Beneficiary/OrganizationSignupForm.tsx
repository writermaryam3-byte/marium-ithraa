'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInputField } from '@/components/shared/forms/PhoneInputField'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ORGANIZATION_TYPES = [
  { value: 'center' },
  { value: 'nursery' },
  { value: 'training' },
  { value: 'school' },
] as const

export default function OrganizationSignupForm() {
  const t = useTranslations('Signup.Beneficiary.Organization')
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
                    <Input
                      type="password"
                      placeholder={t('fields.password.placeholder')}
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
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.organization_name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('fields.organization_name.placeholder')}
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
              name="organizationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.organization_type.label')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('fields.organization_type.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {ORGANIZATION_TYPES.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {t(`fields.organization_type.options.${o.value}`)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
