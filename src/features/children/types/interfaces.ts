import { Gender } from '@/lib/types/enums'

export interface ParentInfo {
  id?: string
  userId?: string
  name?: string
  email?: string
  phone?: string
  parentProfileId?: string
  children?: Child[]
}

export interface ChildClassRef {
  id: string
  name: string
  gradeId?: string
  grade?: { id: string; name: string }
}

export interface Child {
  id: string
  name: string
  birthDate?: string
  gender?: Gender | string
  organizationId?: string
  classId?: string
  gradeId?: string
  parentId?: string
  parentUserId?: string
  userId?: string
  attemptsUsed?: number
  retakeUsed?: boolean
  createdAt?: string
  updatedAt?: string
  grade?: string | { id: string; name: string }
  class?: ChildClassRef
  className?: string
  gradeName?: string
  parent?: ParentInfo
  evaluationStatus?: string
  imgSrc?: string
  evaluationStatusClassName?: string
}

export interface CreatePrivateChildPayload {
  name: string
  birthDate: string
  gender: string
}

export interface CreateChildFlowPayload {
  name: string
  birthDate: string
  gender: string
  classId: string
  parentPhone: string
  parentEmail?: string
  parentName?: string
  grantParentRole?: boolean
}

export type CreateChildResponse =
  | {
      status: 'CREATED'
      message: string
      childId: string
    }
  | {
      status: 'TRANSFER_REQUIRED'
      message: string
      childId: string
      transferRequestId: string
    }

export type ParentSearchResult =
  | {
      status: 'parent_found'
      parent: ParentInfo
      children: (Child & { type: 'organization' | 'private' })[]
    }
  | { status: 'not_found' }
  | {
      status: 'not_parent'
      user: {
        id: string
        name?: string
        phone: string
        email?: string
        roles?: string[]
      }
    }

export type ChildTransferRequest = {
  id: string
  childId: string
  childType: 'organization' | 'private'
  organizationChildId?: string | null
  privateChildId?: string | null
  fromOrganizationId: string
  toOrganizationId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  child?: Child & { type?: string; class?: ChildClassRef }
  fromOrganization?: {
    id: string
    organizationName: string
  }
  toOrganization?: {
    id: string
    organizationName: string
  }
}

export type TransferRequestResponse = ChildTransferRequest

export type ChildTransferStatus = 'pending' | 'approved' | 'rejected'

export interface UpdateChildPayload {
  name?: string
  birthDate?: string
  gender?: string
  classId?: string
}

export interface ChildReport {
  id: string
  assignment: unknown
  score_json: string
  created_at: string
}

export interface ChildProfile {
  id: string
  child: Child
  diagnoses: string
  notes: string
  status: string
}
