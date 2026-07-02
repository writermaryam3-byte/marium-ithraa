import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import type { Deal, Proposal, CreateDealPayload, SubmitProposalPayload } from '../types'

export const getDeals = async (status?: string) => {
  const query = status ? `?status=${status}` : ''
  return api.client<Deal[]>(`/${Endpoint.DEALS}${query}`)
}

export const getDealById = async (dealId: string) => {
  return api.client<Deal>(`/${Endpoint.DEALS}/${dealId}`)
}

export const createDeal = async (data: CreateDealPayload) => {
  return api.client<Deal>(`/${Endpoint.DEALS}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const submitProposal = async (dealId: string, data: SubmitProposalPayload) => {
  return api.client<Proposal>(`/${Endpoint.DEALS}/${dealId}/${Endpoint.PROPOSALS}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const selectProposal = async (dealId: string, proposalId: string) => {
  return api.client<Proposal>(
    `/${Endpoint.DEALS}/${dealId}/${Endpoint.PROPOSALS}/${proposalId}/${Endpoint.SELECT}`,
    { method: Methods.POST },
  )
}

export const approveProposal = async (dealId: string, proposalId: string) => {
  return api.client<Proposal>(
    `/${Endpoint.DEALS}/${dealId}/${Endpoint.PROPOSALS}/${proposalId}/${Endpoint.APPROVE}`,
    { method: Methods.POST },
  )
}

export const getDealProposals = async (dealId: string) => {
  return api.client<Proposal[]>(`/${Endpoint.DEALS}/${dealId}/${Endpoint.PROPOSALS}`)
}

export const updateProposal = async (proposalId: string, data: { price: number }) => {
  return api.client<Proposal>(`/${Endpoint.PROPOSALS}/${proposalId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const getActivities = async () => {
  return api.client<import('../types').Activity[]>(`/${Endpoint.ACTIVITIES}`)
}

export const getActivitiesWithDeals = async () => {
  return api.client<import('../types').ActivityWithDeals[]>(
    `/${Endpoint.ACTIVITIES}/${Endpoint.WITH_DEALS}`,
  )
}

export const createActivity = async (name: string) => {
  return api.client<import('../types').Activity>(`/${Endpoint.ACTIVITIES}`, {
    method: Methods.POST,
    body: JSON.stringify({ name }),
  })
}

export const updateActivity = async (id: string, name: string) => {
  return api.client<import('../types').Activity>(`/${Endpoint.ACTIVITIES}/${id}`, {
    method: Methods.PATCH,
    body: JSON.stringify({ name }),
  })
}

export const deleteActivity = async (id: string) => {
  return api.client<void>(`/${Endpoint.ACTIVITIES}/${id}`, {
    method: Methods.DELETE,
  })
}
