'use server'

import { revalidatePath } from 'next/cache'

import {
  deleteFailure,
  deleteSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { idSchema } from '@/features/forms/schemas/common.schema'

import { deleteChild } from '../api'

export type DeleteChildState = DeleteActionResult

export async function deleteChildAction(
  _prevState: DeleteChildState,
  formData: FormData,
): Promise<DeleteChildState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return deleteFailure('Actions.common.invalidId')
  }

  try {
    await deleteChild(parsed.data.id)
    revalidatePath('/dashboards/organization/children')
    return deleteSuccess()
  } catch {
    return deleteFailure('Actions.children.deleteFailed')
  }
}
