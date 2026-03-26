import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { OrganizationSidebar } from '@/features/organizations'
import { getCurrentOrganization } from '@/lib/helpers/getCurrentOrganization'
import { UserRole } from '@/lib/types/enums'
import nextAuthOptions from '@/server/auth'
import { getServerSession } from 'next-auth'
import React, { ReactNode } from 'react'

const OrgnizationLayout = async({ children }: { children: ReactNode }) => {
    const session = await getServerSession(nextAuthOptions)
    if(!session?.user || session.user.role!==UserRole.ORGANIZATIONOWNER)return
    const organization = await getCurrentOrganization()
    console.log("ziad org", organization)
    if(!organization) return
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >

            <OrganizationSidebar organization={organization} variant="inset" />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default OrgnizationLayout