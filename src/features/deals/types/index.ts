export type DealStatus = 'OPEN' | 'AWARDED' | 'CLOSED'

export type ProposalStatus = 'PENDING' | 'SELECTED' | 'APPROVED' | 'REJECTED'

export interface Activity {
  id: string
  name: string
}

export interface ActivityWithDeals extends Activity {
  deals?: Deal[]
}

export interface Deal {
  id: string
  activityId?: string
  activity?: Activity
  organization?: {
    id: string
    organizationName: string
  }
  creator?: {
    id: string
    name: string
  }
  studentsCount: number
  status: DealStatus | string
  deadline: string
  createdAt?: string
  updatedAt?: string
}

export interface Proposal {
  id: string
  enricherId?: string
  dealId?: string
  deal?: Deal
  enricher?: {
    id: string
    name: string
  }
  price: number
  status: ProposalStatus | string
  createdAt?: string
  updatedAt?: string
}

export interface CreateDealPayload {
  activityId: string
  studentsCount: number
  deadline: string
}

export interface SubmitProposalPayload {
  price: number
}
