'use server'

import { revalidatePath } from 'next/cache'

import {
  deleteFailure,
  deleteSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { idSchema } from '@/features/forms/schemas/common.schema'

import { deleteGrade } from '../api'

export type DeleteGradeState = DeleteActionResult

export async function deleteGradeAction(
  _prevState: DeleteGradeState,
  formData: FormData,
): Promise<DeleteGradeState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return deleteFailure('Actions.common.invalidId')
  }

  try {
    await deleteGrade(parsed.data.id)
    revalidatePath('/dashboards/organization/grades')
    return deleteSuccess()
  } catch {
    return deleteFailure('Actions.grades.deleteFailed')
  }
}
