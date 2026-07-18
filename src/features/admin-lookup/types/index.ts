export type LookupOption = {
  id: string
  label: string
  description?: string
}

export type LookupParams = {
  search?: string
  page?: number
  limit?: number
  type?: 'organization' | 'private' | 'all'
}

export type LookupResult = {
  items: LookupOption[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
