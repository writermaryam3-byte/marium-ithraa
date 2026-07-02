'use client'

import * as React from 'react'
import { LayoutDashboard, FileText, Bell } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Pages, Routes } from '@/lib/types/enums'

const PARENT_URL = `/${Routes.DASHBOARDS}/${Pages.PARENT}`

export default function ParentSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const t = useTranslations('Dashboard.Nav')
  const tParent = useTranslations('Features.ParentDashboard')
  const tNotif = useTranslations('Features.Notifications')

  const data = {
    user: {
      name: session?.user.name || '',
      email: session?.user.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: t('dashboard'),
        url: PARENT_URL,
        icon: LayoutDashboard,
      },
      {
        title: tParent('children'),
        url: `${PARENT_URL}/children`,
        icon: FileText,
      },
      {
        title: tParent('evaluations'),
        url: `${PARENT_URL}/evaluations`,
        icon: FileText,
      },
      {
        title: tNotif('title'),
        url: `/${Routes.DASHBOARDS}/notifications`,
        icon: Bell,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href={PARENT_URL}>
                <span className="text-base font-semibold">Parent</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
