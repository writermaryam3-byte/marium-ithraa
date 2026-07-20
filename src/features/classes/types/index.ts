import { type Child } from '@/features/children/types/interfaces'

export interface ClassItem {
  id: string
  name: string
  gradeId: string
  gradeName?: string
  organizationId?: string
  organizationName?: string
  teacherId?: string
  teacherName?: string
  childrenCount?: number | string
  evaluatedCount?: number
  children?: Child[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateClassPayload {
  name: string
  gradeId: string
  teacherId?: string
}

export interface UpdateClassPayload {
  name?: string
  gradeId?: string
  teacherId?: string
}
