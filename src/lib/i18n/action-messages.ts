/**
 * Normalizes legacy server-action message keys (e.g. `Actions.grades.updated`)
 * to the `actions` namespace (`grades.updated`).
 */
export function normalizeActionMessageKey(key: string): string {
  if (key.startsWith('Actions.')) {
    return key.slice('Actions.'.length)
  }
  if (key.startsWith('actions.')) {
    return key.slice('actions.'.length)
  }
  return key
}
