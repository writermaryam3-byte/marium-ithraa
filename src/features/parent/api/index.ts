import { api } from '@/lib/api/api'
import { Endpoint } from '@/lib/types/enums'

import type { ParentProfileSummary } from '../types/interfaces'

export async function getParentProfile() {
  return api.client<ParentProfileSummary>(`/${Endpoint.PARENT}/profile`)
}

export async function getParentProfileServer() {
  return api.server<ParentProfileSummary>(`/${Endpoint.PARENT}/profile`)
}
