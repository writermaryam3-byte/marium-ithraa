'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { createTeacherSchema } from '@/features/forms/schemas/teacher.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { createTeacher } from '../api'

export async function createTeacherAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createTeacherSchema)
  if (!parsed.success) return parsed.state

  try {
    await createTeacher(parsed.data)
    revalidatePath('/dashboards/organization/teachers')
    return actionSuccess('Actions.teachers.created', StatusCode.CREATED)
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: 'Actions.common.conflict',
    })
  }
}
