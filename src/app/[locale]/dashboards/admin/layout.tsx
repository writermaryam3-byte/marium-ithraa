import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/features/admin'
import RequireRoles from '@/features/auth/components/RequireRoles'
import { UserRole } from '@/lib/types/enums'
import React, { ReactNode } from 'react'

const AdminLayout = async ({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <RequireRoles allowed={[UserRole.ADMIN]} locale={locale}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AdminSidebar variant="inset" dir={dir} />
        <SidebarInset className="bg-surface">{children}</SidebarInset>
      </SidebarProvider>
    </RequireRoles>
  )
}

export default AdminLayout
