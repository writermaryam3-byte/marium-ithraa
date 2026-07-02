import React, { ReactNode } from 'react'

import { DashboardTopBar } from '@/components/shared/dashboard/DashboardTopBar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import RequireRoles from '@/features/auth/components/RequireRoles'
import TeacherSidebar from '@/features/teachers/components/teacher-sidebar'
import { UserRole } from '@/lib/types/enums'

const TeacherLayout = async ({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <RequireRoles
      allowed={[UserRole.TEACHER, UserRole.ADMIN]}
      redirectTo="/unauthorized"
      locale={locale}
    >
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <TeacherSidebar variant="inset" dir={dir} />
        <SidebarInset className="bg-surface">
          <DashboardTopBar />
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RequireRoles>
  )
}

export default TeacherLayout
