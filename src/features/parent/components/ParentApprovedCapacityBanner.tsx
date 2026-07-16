'use client'

import { useTranslations } from 'next-intl'
import { CreditCard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { showErrorToast } from '@/lib/toast/app-toast'
import {
  useParentCapacityRequests,
  useResolveCapacityCheckout,
  type CapacityRequest,
} from '@/features/capacity-requests'

function approvedRequests(requests: CapacityRequest[]): CapacityRequest[] {
  return requests.filter((request) => request.status === 'approved')
}

export function ParentApprovedCapacityBanner() {
  const t = useTranslations('dashboard.parent.privateChildren')
  const { data: requests = [] } = useParentCapacityRequests()
  const checkoutMutation = useResolveCapacityCheckout()
  const pendingPayment = approvedRequests(requests)

  if (pendingPayment.length === 0) {
    return null
  }

  const handlePay = async (request: CapacityRequest) => {
    try {
      const session = await checkoutMutation.mutateAsync(request.id)
      if (session.checkoutUrl) {
        window.open(session.checkoutUrl, '_blank', 'noopener,noreferrer')
      }
    } catch {
      showErrorToast({ raw: t('paymentLinkFailed') })
    }
  }

  return (
    <div className="space-y-3">
      {pendingPayment.map((request) => (
        <div
          key={request.id}
          className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <CreditCard className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">{t('approvedCapacityTitle')}</p>
              <p>{t('approvedCapacityDescription', { count: request.requestedCapacity })}</p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="rounded-xl shrink-0"
            disabled={checkoutMutation.isPending}
            onClick={() => handlePay(request)}
          >
            {t('payNow')}
          </Button>
        </div>
      ))}
    </div>
  )
}
