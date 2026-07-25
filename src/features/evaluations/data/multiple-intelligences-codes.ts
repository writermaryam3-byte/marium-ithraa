/** Dimension codes for the eight intelligences assessment (matches backend seed). */
export const MULTIPLE_INTELLIGENCES_CODES = [
  'linguistic',
  'logical',
  'spatial',
  'bodily',
  'musical',
  'interpersonal',
  'intrapersonal',
  'naturalist',
] as const

export type MultipleIntelligencesCode = (typeof MULTIPLE_INTELLIGENCES_CODES)[number]

export function isMultipleIntelligencesCode(code: string): code is MultipleIntelligencesCode {
  return (MULTIPLE_INTELLIGENCES_CODES as readonly string[]).includes(code)
}
