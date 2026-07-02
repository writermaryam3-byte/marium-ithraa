'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { updateGradeSchema } from '@/features/forms/schemas/grade.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { updateGrade } from '../api'

export async function updateGradeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, updateGradeSchema)
  if (!parsed.success) return parsed.state

  try {
    const { id, name } = parsed.data
    await updateGrade(id, { name })
    revalidatePath('/dashboards/organization/grades')
    revalidatePath(`/dashboards/organization/grades/${id}`)
    return actionSuccess('Actions.grades.updated', StatusCode.OK)
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
