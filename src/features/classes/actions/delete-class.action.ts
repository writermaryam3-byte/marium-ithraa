'use server'

import { revalidatePath } from 'next/cache'

import {
  deleteFailure,
  deleteSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { idSchema } from '@/features/forms/schemas/common.schema'

import { deleteClass } from '../api'

export type DeleteClassState = DeleteActionResult

export async function deleteClassAction(
  _prevState: DeleteClassState,
  formData: FormData,
): Promise<DeleteClassState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return deleteFailure('Actions.common.invalidId')
  }

  try {
    await deleteClass(parsed.data.id)
    revalidatePath('/dashboards/organization/classes')
    return deleteSuccess()
  } catch {
    return deleteFailure('Actions.classes.deleteFailed')
  }
}
