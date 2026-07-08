import { useTranslations } from 'next-intl'

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

/**
 * Translates a backend message to an i18n key.
 * With the new contract, error.message is already an i18n key.
 * This function detects i18n keys (contain '.' but no spaces) and translates them directly.
 */
export function translateBackendMessage(msg: string, t: TranslateFn): string {
  if (msg.includes('.') && !msg.includes(' ')) {
    return t(msg)
  }

  return t(msg)
}

/**
 * Hook for translating backend messages.
 * With the new contract, error.message is already an i18n key,
 * so prefer using `t(error.message)` directly in components.
 */
export function useTranslateBackend() {
  const t = useTranslations('apiErrors')
  return (msg: string) => translateBackendMessage(msg, t)
}
