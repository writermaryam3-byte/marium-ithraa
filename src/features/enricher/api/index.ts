import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { Deal } from '@/features/deals/types'
import type { Proposal } from '@/features/deals/types'

export const getEnricherDeals = async () => {
  return api.client<Deal[]>(`/${Endpoint.ENRICHERS}/${Endpoint.DEALS}`)
}

export const getEnricherDealById = async (dealId: string) => {
  return api.client<Deal>(`/${Endpoint.ENRICHERS}/${Endpoint.DEALS}/${dealId}`)
}

export const getEnricherProposals = async () => {
  return api.client<Proposal[]>(`/${Endpoint.ENRICHERS}/${Endpoint.PROPOSALS}`)
}
