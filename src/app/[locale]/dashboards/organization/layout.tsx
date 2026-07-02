import Footer from '@/components/layouts/footer'
import OrganizationHeader from '@/components/layouts/organizationHeader/OrganizationHeader'
import { OrganizationRouteGuard } from '@/features/organizations'
import { routing } from '@/i18n/routing'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'

import nextAuthOptions from '@/server/auth'
import RequireRoles from '@/features/auth/components/RequireRoles'
import { Pages, Routes, UserRole } from '@/lib/types/enums'
import React from 'react'
import { redirect } from '@/i18n/navigation'
import { getCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'

const OrgnizationLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) => {
  const { locale } = await params
  const session = await getServerSession(nextAuthOptions)

  if (!session?.user) {
    redirect({ href: `/${Routes.AUTH}/${Pages.LOGIN}`, locale })
  }

  const organization = await getCurrentOrganization()
  if (!organization || organization === null) {
    return redirect({ href: `/${Routes.UNAUTHORIZED}`, locale })
  }
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <RequireRoles
      allowed={[UserRole.ORGANIZATIONOWNER, UserRole.ADMIN]}
      redirectTo={`/${Routes.UNAUTHORIZED}`}
      locale={locale}
    >
      <OrganizationHeader locale={locale} approvalStatus={organization.approvalStatus} />
      <div className="pt-28">
        <OrganizationRouteGuard organization={organization} locale={locale}>
          {children}
        </OrganizationRouteGuard>
      </div>
      <Footer locale={locale} />
    </RequireRoles>
  )
}

export default OrgnizationLayout
