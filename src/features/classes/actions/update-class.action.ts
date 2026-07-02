'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { updateClassSchema } from '@/features/forms/schemas/class.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { updateClass } from '../api'

export async function updateClassAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, updateClassSchema)
  if (!parsed.success) return parsed.state

  try {
    const { id, ...payload } = parsed.data
    await updateClass(id, payload)
    revalidatePath('/dashboards/organization/classes')
    revalidatePath(`/dashboards/organization/classes/${id}`)
    return actionSuccess('Actions.classes.updated', StatusCode.OK)
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
