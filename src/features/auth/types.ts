import type { Role } from '@/features/users'
import type { UserRole } from '@/lib/types/enums'

export type VerifyEmailResponse = {
  message: string
  ok: boolean
}

export type AuthUser = {
  id: string
  name: string
  email: string
  phone: string
  roles: Role[]
  accessToken: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
}

export type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type SignInCredentials = {
  phone: string
  password: string
}
