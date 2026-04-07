import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import EnricherSidebar from '@/features/enrichers/components/enricher-sidebar'
import { UserRole } from '@/lib/types/enums'
import nextAuthOptions from '@/server/auth'
import { getServerSession } from 'next-auth'
import React, { ReactNode } from 'react'

const EnricherLayout = async ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >

            <EnricherSidebar variant="inset" />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default EnricherLayout