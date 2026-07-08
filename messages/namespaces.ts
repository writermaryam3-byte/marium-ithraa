export const namespaceFiles = [
  'common',
  'actions',
  'navigation',
  'metadata',
  'validation',
  'errors',
  'api-errors',
  'auth',
  'signup',
  'dashboard',
  'children',
  'teachers',
  'organizations',
  'employees',
  'users',
  'evaluations',
  'deals',
  'notifications',
  'activities',
  'landing',
  'about',
  'privacy',
  'terms',
  'verify-email',
  'dialogs',
  'forms',
  'tables',
  'pagination',
  'emails',
] as const

export type NamespaceFile = (typeof namespaceFiles)[number]

export const namespaceKeys: Record<NamespaceFile, string> = {
  common: 'common',
  actions: 'actions',
  navigation: 'navigation',
  metadata: 'metadata',
  validation: 'validation',
  errors: 'errors',
  'api-errors': 'apiErrors',
  auth: 'auth',
  signup: 'signup',
  dashboard: 'dashboard',
  children: 'children',
  teachers: 'teachers',
  organizations: 'organizations',
  employees: 'employees',
  users: 'users',
  evaluations: 'evaluations',
  deals: 'deals',
  notifications: 'notifications',
  activities: 'activities',
  landing: 'landing',
  about: 'about',
  privacy: 'privacy',
  terms: 'terms',
  'verify-email': 'verifyEmail',
  dialogs: 'dialogs',
  forms: 'forms',
  tables: 'tables',
  pagination: 'pagination',
  emails: 'emails',
}

export type AppLocale = 'en' | 'ar'
export type NamespaceKey = (typeof namespaceKeys)[NamespaceFile]

export type Messages = {
  [K in NamespaceKey]: Record<string, unknown>
}
