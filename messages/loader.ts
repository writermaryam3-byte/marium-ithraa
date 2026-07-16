import type { AppLocale, Messages, NamespaceFile } from './namespaces'
import { namespaceFiles, namespaceKeys } from './namespaces'

export type LoadedMessages = Messages

async function importNamespace(locale: AppLocale, file: NamespaceFile) {
  switch (file) {
    case 'common':
      return (await import(`./${locale}/common.json`)).default
    case 'actions':
      return (await import(`./${locale}/actions.json`)).default
    case 'navigation':
      return (await import(`./${locale}/navigation.json`)).default
    case 'metadata':
      return (await import(`./${locale}/metadata.json`)).default
    case 'validation':
      return (await import(`./${locale}/validation.json`)).default
    case 'errors':
      return (await import(`./${locale}/errors.json`)).default
    case 'api-errors':
      return (await import(`./${locale}/api-errors.json`)).default
    case 'auth':
      return (await import(`./${locale}/auth.json`)).default
    case 'signup':
      return (await import(`./${locale}/signup.json`)).default
    case 'dashboard':
      return (await import(`./${locale}/dashboard.json`)).default
    case 'children':
      return (await import(`./${locale}/children.json`)).default
    case 'teachers':
      return (await import(`./${locale}/teachers.json`)).default
    case 'organizations':
      return (await import(`./${locale}/organizations.json`)).default
    case 'employees':
      return (await import(`./${locale}/employees.json`)).default
    case 'users':
      return (await import(`./${locale}/users.json`)).default
    case 'evaluations':
      return (await import(`./${locale}/evaluations.json`)).default
    case 'deals':
      return (await import(`./${locale}/deals.json`)).default
    case 'notifications':
      return (await import(`./${locale}/notifications.json`)).default
    case 'activities':
      return (await import(`./${locale}/activities.json`)).default
    case 'landing':
      return (await import(`./${locale}/landing.json`)).default
    case 'about':
      return (await import(`./${locale}/about.json`)).default
    case 'privacy':
      return (await import(`./${locale}/privacy.json`)).default
    case 'terms':
      return (await import(`./${locale}/terms.json`)).default
    case 'verify-email':
      return (await import(`./${locale}/verify-email.json`)).default
    case 'dialogs':
      return (await import(`./${locale}/dialogs.json`)).default
    case 'forms':
      return (await import(`./${locale}/forms.json`)).default
    case 'tables':
      return (await import(`./${locale}/tables.json`)).default
    case 'pagination':
      return (await import(`./${locale}/pagination.json`)).default
    case 'emails':
      return (await import(`./${locale}/emails.json`)).default
    case 'payments':
      return (await import(`./${locale}/payments.json`)).default
    default: {
      const _exhaustive: never = file
      throw new Error(`Unknown namespace file: ${_exhaustive}`)
    }
  }
}

export async function loadMessages(locale: AppLocale): Promise<LoadedMessages> {
  const entries = await Promise.all(
    namespaceFiles.map(async (file) => {
      const messages = await importNamespace(locale, file)
      return [namespaceKeys[file], messages] as const
    }),
  )

  return Object.fromEntries(entries) as LoadedMessages
}

export async function loadNamespace<T extends NamespaceFile>(
  locale: AppLocale,
  file: T,
): Promise<Record<string, unknown>> {
  return importNamespace(locale, file)
}
