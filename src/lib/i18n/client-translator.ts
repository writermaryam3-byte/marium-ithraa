type TranslatorFn = (key: string, values?: Record<string, string | number>) => string

let _clientTranslator: TranslatorFn | null = null
let _apiErrorsTranslator: ((key: string) => string) | null = null

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
  if (_apiErrorsTranslator) {
    try {
      return _apiErrorsTranslator(key)
    } catch {
      return key
    }
  }
  return key
}
