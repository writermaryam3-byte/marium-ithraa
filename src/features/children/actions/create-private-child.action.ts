'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionFailure, actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { createPrivateChildSchema } from '@/features/forms/schemas/child.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { createPrivateChild } from '../api'
import { getParentProfileServer } from '@/features/parent/api'

const PRIVATE_CHILD_LIMIT = 2

export async function createPrivateChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createPrivateChildSchema)
  if (!parsed.success) return parsed.state

  const currentCount = parsed.data.currentCount ?? 0
  let maxChildren = PRIVATE_CHILD_LIMIT

  try {
    const profile = await getParentProfileServer()
    maxChildren = profile.maxChildren
  } catch {
    // Fall back to default when profile is unavailable; backend still enforces the limit.
  }

  if (currentCount >= maxChildren) {
    return actionFailure('children.limitReached', StatusCode.BADREQUEST, formData)
  }

  try {
    const { name, birthDate, gender } = parsed.data
    await createPrivateChild({ name, birthDate, gender })
    revalidatePath('/dashboards/parent/children')
    return actionSuccess('children.created', StatusCode.CREATED)
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
