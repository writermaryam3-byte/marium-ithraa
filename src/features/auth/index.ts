export { SignupWizard } from './signup/components/Beneficiary/SignupWizard'
export { type BaseSignup } from './signup/types/interfaces'
export { beneficiariesSignupClient } from './api'
export {
  verifyEmail,
  verifyEmailClient,
  verifyEmailServer,
  logoutClient,
  logoutAllClient,
} from './api'
export type { VerifyEmailResponse } from './types'

export { useAuth } from './hooks/useAuth'
export { useInitAuth } from './hooks/useInitAuth'
export { useRBAC } from './hooks/useRBAC'

export { AuthInit } from './components/AuthInit'
export { AuthNavActions } from './components/AuthNavActions'
export { AuthLoadingScreen } from './components/AuthLoadingScreen'
export { ProtectedRoute } from './components/ProtectedRoute'
export { default as RequireRoles } from './components/RequireRoles'

export { getLoginPath, getLocalizedLoginPath, getPostLoginRedirect, getDashboardPathForRole, getDashboardHomePath } from './utils/redirects'
export {
  syncSessionAfterEmailVerification,
  waitForEmailVerificationAndSync,
} from './utils/sync-session-after-email-verification'
export { mapSessionToAuthUser } from './utils/session-user'
export { hasAnyRole, roleNames } from './utils/rbac'
