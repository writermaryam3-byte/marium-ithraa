'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'

import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import {
  getDeals,
  getDealById,
  createDeal,
  submitProposal,
  selectProposal,
  approveProposal,
  getDealProposals,
  updateProposal,
  getActivities,
  getActivitiesWithDeals,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../api'
import type { CreateDealPayload, SubmitProposalPayload } from '../types'

export const dealKeys = {
  all: ['deals'] as const,
  detail: (id: string) => ['deals', id] as const,
  activities: ['activities'] as const,
  activitiesWithDeals: ['activities', 'with-deals'] as const,
}

export function useDeals(status?: string) {
  return useQuery({
    queryKey: [...dealKeys.all, status],
    queryFn: () => getDeals(status),
  })
}

export function useDealDetail(dealId: string) {
  return useQuery({
    queryKey: dealKeys.detail(dealId),
    queryFn: () => getDealById(dealId),
    enabled: !!dealId,
  })
}

export function useCreateDeal(onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDealPayload) => createDeal(data),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('created') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? tb(error.message) : t('failedCreate') })
    },
  })
}

export function useDealProposals(dealId: string) {
  return useQuery({
    queryKey: ['deals', dealId, 'proposals'],
    queryFn: () => getDealProposals(dealId),
    enabled: !!dealId,
  })
}

export function useUpdateProposal(onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ proposalId, price }: { proposalId: string; price: number }) =>
      updateProposal(proposalId, { price }),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('proposalUpdated') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedUpdateProposal'),
      })
    },
  })
}

export function useSubmitProposal(dealId: string, onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SubmitProposalPayload) => submitProposal(dealId, data),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('proposalSubmitted') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedSubmitProposal'),
      })
    },
  })
}

export function useSelectProposal(dealId: string, onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: string) => selectProposal(dealId, proposalId),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('proposalSelected') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedSelectProposal'),
      })
    },
  })
}

export function useApproveProposal(dealId: string, onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: string) => approveProposal(dealId, proposalId),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('proposalApproved') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedApproveProposal'),
      })
    },
  })
}

export function useActivities() {
  return useQuery({
    queryKey: dealKeys.activities,
    queryFn: getActivities,
  })
}

export function useActivitiesWithDeals() {
  return useQuery({
    queryKey: dealKeys.activitiesWithDeals,
    queryFn: getActivitiesWithDeals,
  })
}

export function useCreateActivity(onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createActivity(name),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('activityCreated') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedCreateActivity'),
      })
    },
  })
}

export function useUpdateActivity(onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateActivity(id, name),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('activityUpdated') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedUpdateActivity'),
      })
    },
  })
}

export function useDeleteActivity(onSuccess?: () => void) {
  const t = useTranslations('Deals')
  const tb = useTranslateBackend()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: t('activityDeleted') })
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({
        raw: error instanceof Error ? tb(error.message) : t('failedDeleteActivity'),
      })
    },
  })
}
