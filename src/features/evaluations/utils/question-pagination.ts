const PAGE_SIZE = 10
const STORAGE_PREFIX = 'eval-question-page:'

export function getQuestionPageSize() {
  return PAGE_SIZE
}

export function readStoredQuestionPage(attemptId: string, totalPages: number): number {
  if (typeof window === 'undefined' || totalPages <= 0) return 1
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${attemptId}`)
    const parsed = raw ? Number.parseInt(raw, 10) : 1
    if (!Number.isFinite(parsed) || parsed < 1) return 1
    return Math.min(parsed, totalPages)
  } catch {
    return 1
  }
}

export function storeQuestionPage(attemptId: string, page: number) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${attemptId}`, String(page))
  } catch {
    // Ignore storage failures (private mode, quota, etc.).
  }
}

export function clearStoredQuestionPage(attemptId: string) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${attemptId}`)
  } catch {
    // Ignore storage failures.
  }
}
