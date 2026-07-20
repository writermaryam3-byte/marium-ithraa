'use client'

import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Input } from '@/components/ui/input'

type PasswordInputProps = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  autoComplete?: 'current-password' | 'new-password'
  ref?: React.Ref<HTMLInputElement>
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  autoFocus,
  autoComplete = 'current-password',
  ref,
}: PasswordInputProps) {
  const t = useTranslations('auth.login.a11y')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative flex items-center">
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="pe-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        onMouseDown={(event) => event.preventDefault()}
        className="absolute inset-e-3 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={showPassword ? t('hidePassword') : t('showPassword')}
      >
        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  )
}
