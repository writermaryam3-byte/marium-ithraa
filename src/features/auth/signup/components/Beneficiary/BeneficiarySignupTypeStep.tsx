'use client'

import { Controller, type Control } from 'react-hook-form'
import { Building2, Sparkles, Users } from 'lucide-react'

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
import { cn } from '@/lib/utils'

interface Props {
  control: Control<BeneficiaryOrganizationFormValues>
}

const ACCOUNT_TYPES = [
  { value: 'organization', icon: Building2 },
  { value: 'parent', icon: Users },
  { value: 'enricher', icon: Sparkles },
] as const

export default function BeneficiarySignupTypeStep({ control }: Props) {
  const t = useTranslations('signup.beneficiary.typeStep')

  return (
    <div className="space-y-5 text-start">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Controller
        name="accountType"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-3"
          >
            {ACCOUNT_TYPES.map(({ value, icon: Icon }) => {
              const isSelected = field.value === value

              return (
                <FieldLabel key={value} htmlFor={value} className="cursor-pointer">
                  <Field
                    orientation="horizontal"
                    className={cn(
                      'items-center gap-4 rounded-2xl border px-4 py-4 shadow-sm transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                        : 'border-border/60 bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-primary',
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <FieldContent className="flex-1 gap-1">
                      <FieldTitle className="text-base font-semibold text-foreground">
                        {t(`options.${value}.title`)}
                      </FieldTitle>
                      <FieldDescription className="text-xs leading-relaxed sm:text-sm">
                        {t(`options.${value}.description`)}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={value} className="shrink-0" />
                  </Field>
                </FieldLabel>
              )
            })}
          </RadioGroup>
        )}
      />
    </div>
  )
}
