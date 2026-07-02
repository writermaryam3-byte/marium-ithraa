// lib/api.ts

import { clientApiFetch } from './client-api-client'
import { serverApiFetch } from './server-api-client'

export const api = {
  client: clientApiFetch,
  server: serverApiFetch,
}
