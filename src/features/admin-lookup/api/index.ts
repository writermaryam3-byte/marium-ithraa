import { api } from '@/lib/api/api'
import { unwrapPaginatedPayload, type PaginatedListPayload } from '@/lib/api/utils'
import type { LookupOption, LookupParams, LookupResult } from '../types'

function toLookupResult(payload: PaginatedListPayload<LookupOption> | LookupOption[]): LookupResult {
  const { items, meta } = unwrapPaginatedPayload(payload)
  return { items, meta }
}

function buildLookupQuery(params?: LookupParams): string {
  const query = new URLSearchParams()
  if (params?.page != null) query.set('page', String(params.page))
  if (params?.limit != null) query.set('limit', String(params.limit))
  if (params?.search?.trim()) query.set('search', params.search.trim())
  if (params?.type) query.set('type', params.type)
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

export async function lookupUsers(params?: LookupParams): Promise<LookupResult> {
  const payload = await api.client<PaginatedListPayload<LookupOption> | LookupOption[]>(
    `/admin/lookup/users${buildLookupQuery(params)}`,
  )
  return toLookupResult(payload)
}

export async function lookupEvaluations(params?: LookupParams): Promise<LookupResult> {
  const payload = await api.client<PaginatedListPayload<LookupOption> | LookupOption[]>(
    `/admin/lookup/evaluations${buildLookupQuery(params)}`,
  )
  return toLookupResult(payload)
}

export async function lookupChildren(params?: LookupParams): Promise<LookupResult> {
  const payload = await api.client<PaginatedListPayload<LookupOption> | LookupOption[]>(
    `/admin/lookup/children${buildLookupQuery(params)}`,
  )
  return toLookupResult(payload)
}
