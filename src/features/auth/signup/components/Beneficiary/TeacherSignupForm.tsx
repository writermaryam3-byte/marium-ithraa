'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { PhoneInputField } from '@/components/shared/forms/PhoneInputField'

const TeacherSignup = () => {
  const t = useTranslations('signup.beneficiary.teacher')
  const { control } = useFormContext()

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('fields.name.label')}</FormLabel>
            <FormControl>
              <Input placeholder={t('fields.name.placeholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PhoneInputField
        name="phone"
        label={t('fields.phone.label')}
        placeholder={t('fields.phone.placeholder')}
      />

      <FormField
        control={control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('fields.subject.label')}</FormLabel>
            <FormControl>
              <Input placeholder={t('fields.subject.placeholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default TeacherSignup
