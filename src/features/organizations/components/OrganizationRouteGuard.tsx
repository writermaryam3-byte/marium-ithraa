'use client'

import { usePathname } from '@/i18n/navigation'
import { ApprovalStatus } from '@/lib/types/enums'

import type { Organization } from '../types/interfaces'
import { isOperationalOrganizationRoute } from '../utils/routes'
import { OrganizationStatusScreen } from './OrganizationStatusScreen'

type Props = {
  organization: Organization
  locale: string
  children: React.ReactNode
}

export function OrganizationRouteGuard({ organization, locale, children }: Props) {
  const pathname = usePathname()

  if (organization.approvalStatus === ApprovalStatus.APPROVED) {
    return children
  }

  if (isOperationalOrganizationRoute(pathname)) {
    return <OrganizationStatusScreen organization={organization} locale={locale} />
  }

  return children
}
