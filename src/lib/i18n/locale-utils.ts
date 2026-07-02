export function getTextDirection(locale: string): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function getDateLocale(locale: string): string {
  return locale === 'ar' ? 'ar-SA' : 'en-US'
}
