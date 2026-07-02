import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'

import type { BeneficiaryOrganizationFormValues } from '../signup/schemas/signup.schema'
import type { BeneficiarySignupOrganization } from '@/features/organizations/types/interfaces'
import type { VerifyEmailResponse } from '../types'

export type { VerifyEmailResponse }

export type BeneficiariesSignupResponse = {
  message?: string
  userId?: string
  user?: {
    id: string
    name: string
    roles: string[]
  }
  organization?: BeneficiarySignupOrganization
}

export type EnricherSignupResponse = {
  message?: string
  user?: {
    id: string
    name: string
    roles: string[]
  }
  enricher?: {
    id: string
    userId: string
    organizationName?: string
    approvalStatus: string
  }
}

export type ParentSignupResponse = {
  message?: string
  user?: {
    id: string
    name: string
    roles: string[]
  }
  parentProfile?: {
    id: string
    userId: string
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

/** @alias verifyEmailServer — used by server pages */
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

export const logoutClient = async () => {
  return api.client<void>(`/${Endpoint.AUTH}/logout`, {
    method: Methods.DELETE,
  })
}

export const logoutAllClient = async () => {
  return api.client<void>(`/${Endpoint.AUTH}/logout-all`, {
    method: Methods.DELETE,
  })
}
