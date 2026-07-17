type TranslateFn = (key: string, values?: Record<string, string | number>) => string

function toTranslationParams(
  metadata?: Record<string, unknown> | null,
): Record<string, string | number> | undefined {
  if (!metadata) return undefined

  const params: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string' || typeof value === 'number') {
      params[key] = value
    }
  }

  return Object.keys(params).length > 0 ? params : undefined
}

export function resolveNotificationText(
  value: string,
  t: TranslateFn,
  metadata?: Record<string, unknown> | null,
): string {
  if (!value.startsWith('notifications.')) {
    return value
  }

  const key = value.slice('notifications.'.length)
  try {
    return t(key, toTranslationParams(metadata))
  } catch {
    return value
  }
}
