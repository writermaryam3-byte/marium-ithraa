import type { ReactNode } from 'react'

import { DashboardTopBar } from '@/components/shared/dashboard/DashboardTopBar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import RequireRoles from '@/features/auth/components/RequireRoles'
import { ParentSidebar } from '@/features/parent'
import { UserRole } from '@/lib/types/enums'

export default async function ParentLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <RequireRoles allowed={[UserRole.PARENT]} redirectTo="/unauthorized" locale={locale}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <ParentSidebar variant="inset" dir={dir} />
        <SidebarInset className="bg-surface">
          <DashboardTopBar />
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RequireRoles>
  )
}
