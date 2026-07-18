import { useTranslations } from 'next-intl'

import { normalizeErrorKey } from '@/lib/i18n/client-translator'

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

/**
 * Translates a backend message key to localized text.
 * Backend sends fully-qualified keys like `errors.common.internalServerError`.
 */
export function translateBackendMessage(msg: string, t: TranslateFn): string {
  if (msg.includes('.') && !msg.includes(' ')) {
    try {
      return t(normalizeErrorKey(msg))
    } catch {
      return msg
    }
  }

  return msg
}

export function useTranslateBackend() {
  const t = useTranslations('errors')
  return (msg: string) => translateBackendMessage(msg, t)
}
