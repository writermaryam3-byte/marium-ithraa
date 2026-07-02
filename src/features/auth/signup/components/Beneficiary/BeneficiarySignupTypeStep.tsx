'use client'

import { Controller, type Control } from 'react-hook-form'

import type { BeneficiaryOrganizationFormValues } from '../../schemas/signup.schema'
import { useTranslations } from 'next-intl'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'

interface Props {
  control: Control<BeneficiaryOrganizationFormValues>
}

export default function BeneficiarySignupTypeStep({ control }: Props) {
  const t = useTranslations('Signup.Beneficiary.TypeStep')

  return (
    <div className="space-y-6 text-start">
      <div>
        <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">{t('title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
      </div>

      <Controller
        name="accountType"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-3 sm:grid-cols-3"
          >
            {['organization', 'parent', 'enricher'].map((value) => (
              <FieldLabel key={value} htmlFor={value}>
                <Field
                  orientation="vertical"
                  className="rounded-2xl border border-border/60 bg-secondary/40 px-3 py-3 shadow-sm hover:border-primary/50"
                >
                  <FieldContent>
                    <FieldTitle className="text-base font-semibold text-foreground">
                      {t(`options.${value}.title`)}
                    </FieldTitle>
                    <FieldDescription className="mt-1 text-xs sm:text-sm">
                      {t(`options.${value}.description`)}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={value} id={value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  )
}
