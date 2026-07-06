'use client'

import { useMemo, useState, useTransition } from 'react'
import type { ReactNode } from 'react'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { useTranslations } from 'next-intl'
import { ArrowRightLeft, Calendar, Check, Loader2, School, X } from 'lucide-react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { EmptyState } from '@/components/shared/management/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { rejectChildTransfer, type ChildTransferRequest } from '@/features/children'
import { formatChildBirthDate, getChildClassName } from '@/features/children/utils/display'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { ApproveChildTransferDialog } from './ApproveChildTransferDialog'

type Props = {
  locale: string
  requests: ChildTransferRequest[]
}

export function ChildTransferRequestsScreen({ locale, requests }: Props) {
  const [items, setItems] = useState(requests)
  const [approveRequest, setApproveRequest] = useState<ChildTransferRequest | null>(null)
  const [rejectRequest, setRejectRequest] = useState<ChildTransferRequest | null>(null)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('Dashboard.ChildTransferRequests')

  const pendingItems = useMemo(() => items.filter((item) => item.status === 'pending'), [items])

  function removeRequest(requestId: string) {
    setItems((current) => current.filter((item) => item.id !== requestId))
  }

  function completeReject() {
    if (!rejectRequest) return

    startTransition(async () => {
      try {
        const response = await rejectChildTransfer(rejectRequest.id)
        removeRequest(rejectRequest.id)
        showSuccessToast({ raw: response.message || t('transferRequestRejected') })
        setRejectRequest(null)
      } catch (error) {
        showErrorToast({ raw: error instanceof Error ? error.message : t('unableToUpdate') })
      }
    })
  }

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: t('dashboardBreadcrumb') },
          { label: t('transferRequestsBreadcrumb') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {pendingItems.length === 0 ? (
        <EmptyState title={t('noPending')} />
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {pendingItems.map((request) => {
            const child = request.child
            const fromName =
              request.fromOrganization?.organizationName ||
              request.fromOrganization?.name ||
              t('anotherOrganization')
            const requestedBy = request.requestedBy?.name || request.requestedBy?.phone

            return (
              <Card key={request.id} className="rounded-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {child?.name || t('unknownChild')}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{t('incoming')}</p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <ArrowRightLeft className="size-3" />
                      {t('pendingBadge')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <TransferField
                      icon={<School />}
                      label={t('fromOrganization')}
                      value={fromName}
                    />
                    <TransferField
                      icon={<Calendar />}
                      label={t('birthDate')}
                      value={formatChildBirthDate(child?.birthDate, locale)}
                    />
                    <TransferField
                      label={t('currentClass')}
                      value={child ? getChildClassName(child) : '-'}
                    />
                    {requestedBy ? (
                      <TransferField label={t('requestedBy')} value={requestedBy} />
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      type="button"
                      className="rounded-lg"
                      onClick={() => setApproveRequest(request)}
                    >
                      <Check className="size-4" />
                      {t('approveTransfer')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => setRejectRequest(request)}
                    >
                      <X className="size-4" />
                      {t('reject')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      <ApproveChildTransferDialog
        open={Boolean(approveRequest)}
        locale={locale}
        request={approveRequest}
        onOpenChange={(open) => {
          if (!open) setApproveRequest(null)
        }}
        onApproved={removeRequest}
      />

      <Dialog
        open={Boolean(rejectRequest)}
        onOpenChange={(open) => !open && setRejectRequest(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rejectTitle')}</DialogTitle>
            <DialogDescription>{t('rejectDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectRequest(null)}
              disabled={isPending}
            >
              {t('cancel')}
            </Button>
            <Button type="button" onClick={completeReject} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {t('reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function TransferField({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border bg-muted/30 p-3">
      {icon ? <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate font-semibold text-foreground">{value || '-'}</p>
      </div>
    </div>
  )
}
