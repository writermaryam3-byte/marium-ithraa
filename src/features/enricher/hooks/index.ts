'use client'

import { useQuery } from '@tanstack/react-query'
import { getEnricherDeals, getEnricherDealById, getEnricherProposals } from '../api'

export const enricherKeys = {
  deals: ['enricher', 'deals'] as const,
  dealDetail: (id: string) => ['enricher', 'deals', id] as const,
  proposals: ['enricher', 'proposals'] as const,
}

export function useEnricherDeals() {
  return useQuery({
    queryKey: enricherKeys.deals,
    queryFn: getEnricherDeals,
  })
}

export function useEnricherDealDetail(dealId: string) {
  return useQuery({
    queryKey: enricherKeys.dealDetail(dealId),
    queryFn: () => getEnricherDealById(dealId),
    enabled: !!dealId,
  })
}

export function useEnricherProposals() {
  return useQuery({
    queryKey: enricherKeys.proposals,
    queryFn: getEnricherProposals,
  })
}
