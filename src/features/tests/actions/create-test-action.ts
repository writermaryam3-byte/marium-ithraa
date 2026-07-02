'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { createTestSchema } from '@/features/forms/schemas/test.schema'
import { StatusCode } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

import { createTest } from '../api'
import type { Test } from '../types/interfaces'

export async function createTestAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createTestSchema)
  if (!parsed.success) return parsed.state

  try {
    await createTest({
      title: parsed.data.title,
      description: parsed.data.description,
      questions: parsed.data.questions as Test['questions'],
    })

    revalidatePath('/dashboards/admin/tests')
    return actionSuccess('Actions.tests.created', StatusCode.CREATED)
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
