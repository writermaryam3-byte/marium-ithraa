import { toast } from 'sonner'
import { ApiError } from '@/lib/errors/ApiError'
import { getClientTranslator } from '@/lib/i18n/client-translator'

type Translator = (key: string) => string

function translate(t: Translator | undefined, key: string): string {
  if (!t) return key
  try {
    return t(key)
  } catch {
    return key
  }
}

function translateApiKey(key: string): string {
  const t = getClientTranslator()
  if (!t) return key
  try {
    return t(key)
  } catch {
    return key
  }
}

function getMessageFromError(error: unknown): string {
  if (error instanceof ApiError) return translateApiKey(error.message)
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return translateApiKey(error)
  return 'An unexpected error occurred'
}

export type NotificationOptions = {
  message?: string
  raw?: string
  error?: unknown
  title?: string
  titleRaw?: string
  description?: string
  descriptionRaw?: string
  t?: Translator
  dedupKey?: string
  duration?: number
}

function resolveMessage(
  t: Translator | undefined,
  msg: { message?: string; raw?: string } | undefined,
): string {
  if (msg?.raw) return msg.raw
  if (msg?.message) return translate(t, msg.message)
  return ''
}

function notify(type: 'success' | 'error' | 'warning' | 'info', opts: NotificationOptions): void {
  const { t, dedupKey, duration } = opts

  let content = ''
  if (opts.error) {
    content = getMessageFromError(opts.error)
  } else {
    content = resolveMessage(t, { message: opts.message, raw: opts.raw })
  }

  if (!content) content = ''

  const title = resolveMessage(t, { message: opts.title, raw: opts.titleRaw })
  const description = resolveMessage(t, { message: opts.description, raw: opts.descriptionRaw })

  const toastId = dedupKey ?? undefined

  switch (type) {
    case 'success':
      toast.success(content, { id: toastId, duration, description })
      break
    case 'warning':
      toast.warning(content, { id: toastId, duration, description })
      break
    case 'info':
      toast.info(content, { id: toastId, duration, description })
      break
    case 'error':
      toast.error(content, { id: toastId, duration, description })
      break
  }
}

// ── Legacy API (translator + key) ──────────────────────────────────────────
export function showSuccessToast(t: Translator, messageKey: string): void
export function showSuccessToast(opts: NotificationOptions): void
export function showSuccessToast(
  tOrOpts: Translator | NotificationOptions,
  messageKey?: string,
): void {
  if (typeof tOrOpts === 'function') {
    toast.success(translate(tOrOpts, messageKey!))
  } else {
    notify('success', tOrOpts)
  }
}

export function showErrorToast(t: Translator, messageKey: string): void
export function showErrorToast(opts: NotificationOptions): void
export function showErrorToast(
  tOrOpts: Translator | NotificationOptions,
  messageKey?: string,
): void {
  if (typeof tOrOpts === 'function') {
    toast.error(translate(tOrOpts, messageKey!))
  } else {
    notify('error', tOrOpts)
  }
}

export function showInfoToast(t: Translator, messageKey: string): void
export function showInfoToast(opts: NotificationOptions): void
export function showInfoToast(
  tOrOpts: Translator | NotificationOptions,
  messageKey?: string,
): void {
  if (typeof tOrOpts === 'function') {
    toast.info(translate(tOrOpts, messageKey!))
  } else {
    notify('info', tOrOpts)
  }
}

export function showWarningToast(t: Translator, messageKey: string): void
export function showWarningToast(opts: NotificationOptions): void
export function showWarningToast(
  tOrOpts: Translator | NotificationOptions,
  messageKey?: string,
): void {
  if (typeof tOrOpts === 'function') {
    toast.warning(translate(tOrOpts, messageKey!))
  } else {
    notify('warning', tOrOpts)
  }
}

// ── Low-level API for non-component contexts (React Query, etc.) ──
export function notifySuccess(message: string, dedupKey?: string): void {
  toast.success(message, { id: dedupKey })
}

export function notifyError(error: unknown, dedupKey?: string): void {
  const msg = getMessageFromError(error)
  toast.error(msg, { id: dedupKey ?? msg })
}

export function notifyInfo(message: string, dedupKey?: string): void {
  toast.info(message, { id: dedupKey })
}

export function notifyWarning(message: string, dedupKey?: string): void {
  toast.warning(message, { id: dedupKey })
}
