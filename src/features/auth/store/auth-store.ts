/**
 * Client-side auth helpers. Session state lives in NextAuth (JWT).
 * Components should use `useAuth()` — not local user state.
 */

export {
  clearAuthTokenCache,
  getCachedAuthToken,
  setAuthTokenCache,
} from '@/lib/api/client-api-client'

export { getDashboardPathForRoles, getLoginPath, getPostLoginRedirect } from '../utils/redirects'
export { mapSessionToAuthUser } from '../utils/session-user'
export type { AuthState, AuthUser, SignInCredentials } from '../types'
