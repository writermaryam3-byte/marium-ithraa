import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'

import type { BeneficiaryOrganizationFormValues } from '../signup/schemas/signup.schema'
import type { BeneficiarySignupOrganization } from '@/features/organizations/types/interfaces'
import type { VerifyEmailResponse } from '../types'

export type { VerifyEmailResponse }

export type BeneficiariesSignupResponse = {
  user?: {
    id: string
    name: string
    email: string
    phone: string
    roles: { id: string; name: string }[]
    isEmailVerified: boolean
    isPhoneVerified: boolean
  }
  organization?: BeneficiarySignupOrganization
}

export type EnricherSignupResponse = {
  user?: {
    id: string
    name: string
    email: string
    phone: string
    roles: { id: string; name: string }[]
    isEmailVerified: boolean
    isPhoneVerified: boolean
  }
  enricher?: {
    id: string
    organizationName: string
    approvalStatus: string
  }
}

export type ParentSignupResponse = {
  user?: {
    id: string
    name: string
    email: string
    phone: string
    roles: { id: string; name: string }[]
    isEmailVerified: boolean
    isPhoneVerified: boolean
  }
  parentProfile?: {
    id: string
    userId: string
    maxChildren: number
  }
}

export const verifyEmailClient = async (token: string) => {
  const query = new URLSearchParams({ token }).toString()

  return api.client<VerifyEmailResponse>(`/${Endpoint.AUTH}/verify-email?${query}`, {
    method: Methods.GET,
  })
}

export const verifyEmailServer = async (token: string) => {
  const query = new URLSearchParams({ token }).toString()

  return api.server<VerifyEmailResponse>(`/${Endpoint.AUTH}/verify-email?${query}`, {
    method: Methods.GET,
  })
}

export const verifyEmail = verifyEmailServer

export const beneficiariesSignupClient = async (body: BeneficiaryOrganizationFormValues) => {
  return api.client<BeneficiariesSignupResponse>(
    `/${Endpoint.AUTH}/${Endpoint.BENEFICIARIESSIGNUP}`,
    {
      method: Methods.POST,
      body: JSON.stringify(body),
    },
  )
}

export const enrichersSignupClient = async (body: BeneficiaryOrganizationFormValues) => {
  return api.client<EnricherSignupResponse>(`/${Endpoint.AUTH}/${Endpoint.ENRICHERS_SIGNUP}`, {
    method: Methods.POST,
    body: JSON.stringify(body),
  })
}

export const parentSignupClient = async (body: {
  name: string
  email: string
  password: string
  phone: string
}) => {
  return api.client<ParentSignupResponse>(`/${Endpoint.AUTH}/${Endpoint.PARENT_SIGNUP}`, {
    method: Methods.POST,
    body: JSON.stringify(body),
  })
}

export const logoutClient = async (sessionId?: string) => {
  if (sessionId) {
    return api.client<void>(`/${Endpoint.AUTH}/logout/${sessionId}`, {
      method: Methods.DELETE,
    })
  }
  return api.client<void>(`/${Endpoint.AUTH}/logout-all`, {
    method: Methods.DELETE,
  })
}

export const logoutAllClient = async () => {
  return api.client<void>(`/${Endpoint.AUTH}/logout-all`, {
    method: Methods.DELETE,
  })
}

export type PasswordActionResponse = {
  ok: boolean
  message: string
}

export const forgotPasswordClient = async (phone: string) => {
  return api.client<PasswordActionResponse>(`/${Endpoint.AUTH}/${Endpoint.FORGOT_PASSWORD}`, {
    method: Methods.POST,
    body: JSON.stringify({ phone }),
  })
}

export const resetPasswordClient = async (token: string, password: string) => {
  return api.client<PasswordActionResponse>(`/${Endpoint.AUTH}/${Endpoint.RESET_PASSWORD}`, {
    method: Methods.POST,
    body: JSON.stringify({ token, password }),
  })
}

export const changePasswordClient = async (currentPassword: string, newPassword: string) => {
  return api.client<PasswordActionResponse>(
    `/${Endpoint.USERS}/${Endpoint.ME}/${Endpoint.PASSWORD}`,
    {
      method: Methods.PATCH,
      body: JSON.stringify({ currentPassword, newPassword }),
    },
  )
}
