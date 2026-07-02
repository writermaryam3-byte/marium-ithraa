import type { Test } from '../types/interfaces'

export async function createTest(data: Partial<Test>) {
  throw new Error('Tests flow is deprecated. Use evaluations API instead.')
}
