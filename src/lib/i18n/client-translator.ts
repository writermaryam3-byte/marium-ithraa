type TranslatorFn = (key: string, values?: Record<string, string | number>) => string

let _clientTranslator: TranslatorFn | null = null
let _apiErrorsTranslator: ((key: string) => string) | null = null

/** Backend sends `errors.common.foo`; next-intl namespace is already `errors`. */
export function normalizeErrorKey(key: string): string {
  return key.startsWith('errors.') ? key.slice('errors.'.length) : key
}

export function setClientTranslator(t: TranslatorFn): void {
  _clientTranslator = t
}

export function getClientTranslator(): TranslatorFn | null {
  return _clientTranslator
}

export function setApiErrorsTranslator(t: (key: string) => string): void {
  _apiErrorsTranslator = t
}

export function getApiErrorsTranslator(): ((key: string) => string) | null {
  return _apiErrorsTranslator
}

export function translateApiKey(key: string): string {
  const normalized = normalizeErrorKey(key)
  if (_apiErrorsTranslator) {
    try {
      return _apiErrorsTranslator(normalized)
    } catch {
      return key
    }
  }
  return key
}
