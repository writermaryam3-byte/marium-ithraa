export interface CapacityRequest {
  id: string
  childName: string
  childBirthDate?: string
  childGender?: string
  childGrade?: string
  notes?: string
  parentPhone: string
  parentName: string
  parentEmail?: string
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
  rejectionReason?: string
  organizationId?: string
  createdAt: string
  updatedAt: string
}

export type CapacityRequestStatus = CapacityRequest['status']

export interface CreateCapacityRequestPayload {
  childName: string
  childBirthDate?: string
  childGender?: string
  childGrade?: string
  notes?: string
  parentPhone: string
  parentName: string
  parentEmail?: string
}

export interface UpdateCapacityRequestPayload {
  status?: CapacityRequestStatus
  adminNotes?: string
}
