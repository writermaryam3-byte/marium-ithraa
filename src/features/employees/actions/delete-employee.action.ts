'use server'

import {
  deleteFailure,
  deleteSuccess,
  type DeleteActionResult,
} from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { idSchema } from '@/features/forms/schemas/common.schema'

import { deleteEmployee } from '../api'

export type DeleteEmployeeState = DeleteActionResult

export async function deleteEmployeeAction(
  _prevState: DeleteEmployeeState,
  formData: FormData,
): Promise<DeleteEmployeeState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return deleteFailure('Actions.common.invalidId')
  }

  try {
    await deleteEmployee(parsed.data.id)
    return deleteSuccess()
  } catch {
    return deleteFailure('Actions.employees.deleteFailed')
  }
}
