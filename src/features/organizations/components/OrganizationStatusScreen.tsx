'use client'

import { Clock, Mail, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { ApprovalStatus } from '@/lib/types/enums'

import type { Organization } from '../types/interfaces'
import { OrganizationApprovalBadge } from './OrganizationApprovalBadge'

type Props = {
  organization: Organization
  locale: string
}

export function OrganizationStatusScreen({ organization, locale }: Props) {
  const t = useTranslations('organizations')
  const isAr = locale === 'ar'
  const isPending = organization.approvalStatus === ApprovalStatus.PENDING
  const isRejected = organization.approvalStatus === ApprovalStatus.REJECTED

  return (
    <main className="app-container py-12" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border/60 bg-background/90 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t('statusLabel')}</p>
            <h1 className="text-2xl font-bold text-foreground">{organization.organizationName}</h1>
            <p className="text-sm text-muted-foreground">
              {t(`types.${organization.organizationType}`)}
            </p>
          </div>
          <OrganizationApprovalBadge status={organization.approvalStatus} />
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
          {isPending ? (
            <Clock className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
          ) : isRejected ? (
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
          ) : null}
          <div className="space-y-2">
            <p className="font-semibold text-foreground">
              {isPending ? t('messages.pending.title') : t('messages.rejected.title')}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPending ? t('messages.pending.description') : t('messages.rejected.description')}
            </p>
            {isRejected && organization.rejectionReason ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
                  {t('messages.rejected.reasonLabel')}
                </p>
                <p className="mt-1 text-sm text-foreground">{organization.rejectionReason}</p>
              </div>
            ) : null}
          </div>
        </div>

        {isRejected ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href="mailto:support@ithrathaka.com">
                <Mail className="size-4" />
                {t('messages.rejected.contactSupport')}
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/auth/login">{t('messages.rejected.backToLogin')}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  )
}
