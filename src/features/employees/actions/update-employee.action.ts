'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { updateEmployeeSchema } from '@/features/forms/schemas/employee.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { updateEmployee } from '../api'

export async function updateEmployeeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, updateEmployeeSchema)
  if (!parsed.success) return parsed.state

  try {
    const { id, ...payload } = parsed.data
    await updateEmployee(id, payload)
    revalidatePath('/dashboards/organization/employees')
    return actionSuccess('Actions.employees.updated', StatusCode.OK)
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
