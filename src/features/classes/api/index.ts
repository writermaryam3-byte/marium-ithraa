import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import { type ClassItem, type CreateClassPayload, type UpdateClassPayload } from '../types'

export const getClassesByOrg = async (orgId: string) => {
  return api.server<{ classes: ClassItem[] }>(`/${Endpoint.CLASSES}/organization/${orgId}`)
}

export const getOrganizationClasses = async (organizationId: string) => {
  return api.client<{ classes: ClassItem[] }>(`/${Endpoint.CLASSES}/organization/${organizationId}`)
}

export const getClassesByGrade = async (gradeId: string) => {
  return api.server<{ classes: ClassItem[] }>(`/${Endpoint.CLASSES}/grade/${gradeId}`)
}

export const getClassesByTeacher = async (teacherId: string) => {
  return api.server<{ classes: ClassItem[] }>(`/${Endpoint.CLASSES}/teacher/${teacherId}`)
}

export const getClassById = async (classId: string) => {
  const classItem = await api.server<ClassItem>(`/${Endpoint.CLASSES}/${classId}`)
  return { class: classItem }
}

export const createClass = async (data: CreateClassPayload) => {
  return api.server(`/${Endpoint.CLASSES}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const updateClass = async (classId: string, data: UpdateClassPayload) => {
  return api.server(`/${Endpoint.CLASSES}/${classId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteClass = async (classId: string) => {
  return api.server(`/${Endpoint.CLASSES}/${classId}`, {
    method: Methods.DELETE,
  })
}
