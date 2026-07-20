type TranslateFn = (key: string, values?: Record<string, string | number>) => string

function tryTranslate(t: TranslateFn, key: string): string | null {
  try {
    const result = t(key as never)
    if (result && result !== key) return result
  } catch {
    // key missing in this namespace
  }
  return null
}

/**
 * Resolves a validation/error message key from any supported namespace.
 * Keys may be fully qualified (`validation.createChild.nameRequired`) or short (`createChild.nameRequired`).
 */
export function translateValidationKey(
  message: string,
  translators: {
    validation: TranslateFn
    errors: TranslateFn
    forms?: TranslateFn
  },
): string {
  if (!message?.trim()) return message
  if (message.includes(' ') && !message.startsWith('validation.') && !message.startsWith('errors.')) {
    return message
  }

  const { validation, errors, forms } = translators

  if (message.startsWith('validation.')) {
    const shortKey = message.slice('validation.'.length)
    return (
      tryTranslate(validation, shortKey) ??
      tryTranslate(validation, message) ??
      (forms ? tryTranslate(forms, message) : null) ??
      message
    )
  }

  if (message.startsWith('errors.')) {
    const shortKey = message.slice('errors.'.length)
    return tryTranslate(errors, shortKey) ?? message
  }

  return (
    tryTranslate(validation, message) ??
    tryTranslate(errors, message) ??
    (forms ? tryTranslate(forms, message) : null) ??
    message
  )
}
