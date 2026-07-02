'use server'

import { revalidatePath } from 'next/cache'

import { actionErrorState } from '@/features/forms/action-errors'
import { actionSuccess } from '@/features/forms/action-results'
import { parseFormData } from '@/features/forms/parse-form-data'
import { createAdminChildSchema, createOrgChildSchema } from '@/features/forms/schemas/child.schema'
import { StatusCode } from '@/lib/types/enums'
import { type InitialState } from '@/lib/types/types'

import { createChild } from '../api'

export async function createChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const organizationId = formData.get('organizationId')
  if (organizationId && String(organizationId).length > 0) {
    const parsed = parseFormData(formData, createOrgChildSchema)
    if (!parsed.success) return parsed.state

    try {
      const {
        organizationId,
        name,
        birthDate,
        gender,
        classId,
        parentName,
        parentEmail,
        parentPhone,
        parentPassword,
      } = parsed.data

      await createChild({
        child: {
          name,
          birthDate,
          gender,
          classId,
          organizationId,
        },
        parent: {
          name: parentName,
          email: parentEmail,
          phone: parentPhone,
          password: parentPassword,
        },
      })
      revalidatePath('/dashboards/organization/children')
      return actionSuccess('children.created', StatusCode.CREATED)
    } catch (error) {
      return actionErrorState(error, formData, {
        conflict: 'children.conflict',
      })
    }
  }

  const adminParsed = parseFormData(formData, createAdminChildSchema)
  if (!adminParsed.success) return adminParsed.state

  try {
    await createChild(adminParsed.data)
    revalidatePath('/dashboards/admin/children')
    return actionSuccess('children.created', StatusCode.CREATED)
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: 'children.conflict',
    })
  }
}
