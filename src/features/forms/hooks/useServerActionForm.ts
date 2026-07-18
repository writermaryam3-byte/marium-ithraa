'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState, useEffect, useTransition, useRef } from 'react'
import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form'
import type { z } from 'zod'

import type { InitialState } from '@/lib/types/types'

const emptyState: InitialState = {
  message: '',
  error: {},
  status: null,
  formData: null,
}

type UseServerActionFormOptions<T extends FieldValues> = {
  schema: z.ZodType<T>
  defaultValues: DefaultValues<T>
  action: (_prev: InitialState, formData: FormData) => Promise<InitialState>
  onStatusChange?: (state: InitialState) => void
}

export function useServerActionForm<T extends FieldValues>({
  schema,
  defaultValues,
  action,
  onStatusChange,
}: UseServerActionFormOptions<T>) {
  const [state, formAction] = useActionState(action, emptyState)
  const [isPending, startTransition] = useTransition()

  const form = useForm<T>({
    resolver: zodResolver(schema as unknown as z.ZodType<any, any, any>) as Resolver<T>,
    defaultValues,
    mode: 'onTouched',
  })

  useEffect(() => {
    if (!state?.formData || !(state.formData instanceof FormData)) return

    for (const key of Object.keys(defaultValues as Record<string, unknown>)) {
      const value = state.formData.get(key)
      if (value != null) {
        form.setValue(key as never, String(value) as never)
      }
    }

    if (state.fieldErrors) {
      for (const [key, message] of Object.entries(state.fieldErrors)) {
        if (message) form.setError(key as never, { message })
      }
    } else if (state.error) {
      for (const [key, messages] of Object.entries(state.error)) {
        if (messages?.[0]) {
          form.setError(key as never, { message: messages[0] })
        }
      }
    }
  }, [state.formData, state.fieldErrors, state.error, defaultValues, form])

  // 2. احفظ الدالة داخل Ref لضمان الحصول على أحدث نسخة بدون تفعيل الـ useEffect
  const onStatusChangeRef = useRef(onStatusChange)
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange
  }, [onStatusChange])

  // 3. الـ useEffect الآمن الآن يعتمد فقط على الـ state.status
  useEffect(() => {
    if (state?.status && onStatusChangeRef.current) {
      onStatusChangeRef.current(state)
    }
  }, [state]) // <--- تم إزالة onStatusChange من هنا تماماً!

  const submit = (values: T, extra?: Record<string, string>) => {
    const fd = new FormData()
    // Form values must win over hidden metadata (e.g. id-only extras).
    const merged = { ...extra, ...values } as Record<string, unknown>

    for (const [key, value] of Object.entries(merged)) {
      if (value !== undefined && value !== null) {
        fd.set(key, String(value))
      }
    }

    startTransition(() => {
      formAction(fd)
    })
  }

  return { form, submit, state, isPending }
}
