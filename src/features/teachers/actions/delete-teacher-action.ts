'use server'

import { revalidatePath } from 'next/cache'

import {
  deleteFailure,
  deleteSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { idSchema } from '@/features/forms/schemas/common.schema'

import { deleteTeacher } from '../api'

export type DeleteTeacherState = DeleteActionResult

export async function deleteTeacherAction(
  _prevState: DeleteTeacherState,
  formData: FormData,
): Promise<DeleteTeacherState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return deleteFailure('common.invalidId')
  }

  try {
    await deleteTeacher(parsed.data.id)
    revalidatePath('/dashboards/organization/teachers')
    return deleteSuccess()
  } catch {
    return deleteFailure('teachers.deleteFailed')
  }
}
