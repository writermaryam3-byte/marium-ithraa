import { z } from 'zod'

const MAX_CHILD_AGE_YEARS = 25

function parseBirthDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export const birthDateSchema = z
  .string()
  .min(1, 'errors.birthDate_required')
  .superRefine((value, ctx) => {
    const date = parseBirthDate(value)
    if (!date) {
      ctx.addIssue({ code: 'custom', message: 'errors.birthDate_invalid' })
      return
    }

    const today = new Date()
    today.setHours(23, 59, 59, 999)

    if (date > today) {
      ctx.addIssue({ code: 'custom', message: 'errors.birthDate_future' })
      return
    }

    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - MAX_CHILD_AGE_YEARS)
    if (date < minDate) {
      ctx.addIssue({
        code: 'custom',
        message: `errors.birthDate_max`,
      })
    }
  })
