import { type Child } from '../types/interfaces'

export function getChildGradeName(child: Child): string {
  if (typeof child.grade === 'object' && child.grade?.name) return child.grade.name
  if (typeof child.grade === 'string') return child.grade
  if (child.gradeName) return child.gradeName
  if (child.class?.grade?.name) return child.class.grade.name
  return '—'
}

export function getChildClassName(child: Child): string {
  if (child.class?.name) return child.class.name
  if (child.className) return child.className
  return '—'
}

export function getChildEvaluationLabel(
  child: Child,
  t: (key: string) => string,
): {
  label: string
  className: string
} {
  if (child.evaluationStatus) {
    return {
      label: child.evaluationStatus,
      className: child.evaluationStatusClassName ?? 'text-emerald-600',
    }
  }
  const evaluated = (child.attemptsUsed ?? 0) > 0 || child.retakeUsed === true
  return evaluated
    ? {
        label: t('status.evaluation.evaluated'),
        className: 'text-emerald-600',
      }
    : {
        label: t('status.evaluation.notEvaluated'),
        className: 'text-amber-600',
      }
}

export function formatChildBirthDate(value?: string, locale = 'ar'): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
}

export function childMatchesSearch(child: Child, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const parent = child.parent
  return (
    child.name.toLowerCase().includes(q) ||
    (parent?.name?.toLowerCase().includes(q) ?? false) ||
    (parent?.email?.toLowerCase().includes(q) ?? false) ||
    (parent?.phone?.toLowerCase().includes(q) ?? false)
  )
}
