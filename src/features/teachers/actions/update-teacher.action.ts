'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { updateTeacherSchema } from '@/features/forms/schemas/teacher.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { updateTeacher } from '../api'

export async function updateTeacherAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, updateTeacherSchema)
  if (!parsed.success) return parsed.state

  try {
    const { id, ...payload } = parsed.data
    await updateTeacher(id, payload)
    revalidatePath('/dashboards/organization/teachers')
    return actionSuccess('teachers.updated', StatusCode.OK)
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
