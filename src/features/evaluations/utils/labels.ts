import type { EvaluationType } from '../types'

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

function toCamelCase(value: string): string {
  return value.toLowerCase().replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

export function getEvaluationTypeLabel(type: EvaluationType, t: TranslateFn): string {
  return t(`types.${toCamelCase(type)}`)
}

export function formatAgeRange(
  ageFrom?: number | null,
  ageTo?: number | null,
  t?: TranslateFn,
): string {
  if (!t) {
    if (ageFrom == null && ageTo == null) return 'All ages'
    if (ageFrom != null && ageTo != null) return `${ageFrom} - ${ageTo} years`
    if (ageFrom != null) return `From ${ageFrom}`
    return `Up to ${ageTo}`
  }
  if (ageFrom == null && ageTo == null) return t('ageRangeOptions.all')
  if (ageFrom != null && ageTo != null) {
    return t('ageRangeOptions.range', { from: ageFrom, to: ageTo })
  }
  if (ageFrom != null) return t('ageRangeOptions.from', { from: ageFrom })
  return t('ageRangeOptions.upTo', { to: ageTo ?? 0 })
}

export const EVALUATION_TYPE_LABELS: Record<EvaluationType, { ar: string; en: string }> = {
  multiple_intelligences: {
    ar: 'الذكاءات المتعددة',
    en: 'Multiple Intelligences',
  },

  pride: {
    ar: 'برايد',
    en: 'Pride',
  },

  renzulli: {
    ar: 'رينزولي',
    en: 'Renzulli',
  },

  holland: {
    ar: 'هولاند',
    en: 'Holland',
  },

  learning_styles: {
    ar: 'أنماط التعلم',
    en: 'Learning Styles',
  },

  torrance: {
    ar: 'تورانس',
    en: 'Torrance',
  },

  preschool_giftedness: {
    ar: 'الموهبة في مرحلة ما قبل المدرسة',
    en: 'Preschool Giftedness',
  },
}

export function getAttemptStatusLabel(status: string, t: TranslateFn): string {
  const key = `attemptStatus.${toCamelCase(status)}` as const
  try {
    const translated = t(key)
    if (translated !== key) return translated
  } catch {
    // fall through
  }
  return status
}
