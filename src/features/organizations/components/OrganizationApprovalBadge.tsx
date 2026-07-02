'use client'

import { Badge } from '@/components/ui/badge'
import { ApprovalStatus } from '@/lib/types/enums'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type Props = {
  status: ApprovalStatus
  className?: string
}

const statusStyles: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  [ApprovalStatus.APPROVED]:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  [ApprovalStatus.REJECTED]:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
}

export function OrganizationApprovalBadge({ status, className }: Props) {
  const t = useTranslations('Features.Organizations.status')

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full px-3 py-1 text-xs font-semibold',
        statusStyles[status],
        className,
      )}
      aria-label={t(status)}
    >
      {t(status)}
    </Badge>
  )
}
