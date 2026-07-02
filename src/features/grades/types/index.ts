import { type ClassItem } from '@/features/classes/types'

export interface Grade {
  id: string
  name: string
  organizationId: string
  classes?: ClassItem[]
  classesCount?: number
  childrenCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateGradePayload {
  name: string
  organizationId: string
}

export interface UpdateGradePayload {
  name: string
}
