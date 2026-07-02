import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import { type CreateGradePayload, type Grade, type UpdateGradePayload } from '../types'

export const getGradesByOrg = async (orgId: string) => {
  return api.server<{ grades: Grade[] }>(`/${Endpoint.GRADES}/organization/${orgId}`)
}

export const getGradeById = async (gradeId: string) => {
  return api.server<{ grade: Grade }>(`/${Endpoint.GRADES}/${gradeId}`)
}

export const createGrade = async (data: CreateGradePayload) => {
  return api.server(`/${Endpoint.GRADES}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const updateGrade = async (gradeId: string, data: UpdateGradePayload) => {
  return api.server(`/${Endpoint.GRADES}/${gradeId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteGrade = async (gradeId: string) => {
  return api.server(`/${Endpoint.GRADES}/${gradeId}`, {
    method: Methods.DELETE,
  })
}
