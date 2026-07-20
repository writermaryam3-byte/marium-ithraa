'use client'

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { TranslatedFormMessage } from './TranslatedFormMessage'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/shared/forms/PasswordInput'
import { PhoneInputField } from '@/components/shared/forms/PhoneInputField'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { InputTypes } from '@/lib/types/enums'
import type { IFormField } from '@/lib/types/interfaces'

type Props = {
  fields: IFormField[]
}

export function RhfFormFields({ fields }: Props) {
  const form = useFormContext()

  return (
    <>
      {fields.map((field) => {
        const type = field.type as InputTypes

        if (type === InputTypes.TEL) {
          return (
            <PhoneInputField
              key={field.name}
              name={field.name}
              label={field.label ?? ''}
              placeholder={field.placeholder}
              disabled={field.disabled}
            />
          )
        }

        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as never}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>{renderControl(field, rhfField)}</FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </>
  )
}

function renderControl(
  field: IFormField,
  rhfField: {
    name: string
    value: string
    onChange: (value: unknown) => void
    onBlur: () => void
    ref: React.Ref<HTMLInputElement>
  },
) {
  const type = field.type as InputTypes

  if (type === InputTypes.PASSWORD) {
    return (
      <PasswordInput
        placeholder={field.placeholder}
        disabled={field.disabled}
        autoFocus={field.autoFocus}
        value={String(rhfField.value ?? '')}
        onChange={rhfField.onChange}
        onBlur={rhfField.onBlur}
        ref={rhfField.ref}
      />
    )
  }

  if (type === InputTypes.CHECKBOX) {
    return (
      <Checkbox
        checked={field.checked ?? false}
        onCheckedChange={(checked) => rhfField.onChange(checked)}
      />
    )
  }

  if (type === InputTypes.TEXTAREA) {
    return (
      <Textarea
        placeholder={field.placeholder}
        disabled={field.disabled}
        value={String(rhfField.value ?? '')}
        onChange={(e) => rhfField.onChange(e.target.value)}
        onBlur={rhfField.onBlur}
      />
    )
  }

  if (type === InputTypes.SELECT && field.data) {
    return (
      <Select
        value={String(rhfField.value ?? '')}
        onValueChange={(value) => rhfField.onChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {field.data.map((item) => (
              <SelectItem key={item.id || item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      type={
        type === InputTypes.EMAIL
          ? 'email'
          : type === InputTypes.NUMBER
            ? 'number'
            : type === InputTypes.DATE
              ? 'date'
              : 'text'
      }
      placeholder={field.placeholder}
      disabled={field.disabled}
      autoFocus={field.autoFocus}
      name={rhfField.name}
      value={String(rhfField.value ?? '')}
      onChange={rhfField.onChange}
      onBlur={rhfField.onBlur}
      ref={rhfField.ref}
    />
  )
}
