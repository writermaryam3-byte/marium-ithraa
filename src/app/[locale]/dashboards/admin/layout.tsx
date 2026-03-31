import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/features/admin"
import { UserRole } from "@/lib/types/enums"
import nextAuthOptions from "@/server/auth"
import { getServerSession } from "next-auth"
import React, { ReactNode } from "react"

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(nextAuthOptions)

  // if (!session?.user || session.user.role[0] !== UserRole.ADMIN) return null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout

