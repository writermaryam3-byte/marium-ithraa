'use client'

import * as React from 'react'
import { LayoutDashboard, FileText, Bell, Settings } from 'lucide-react'
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
  const t = useTranslations('navigation.dashboard')
  const tParent = useTranslations('dashboard.parent')
  const tNotif = useTranslations('notifications')
  const tAuth = useTranslations('auth')

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
      {
        title: tAuth('accountSettings'),
        url: `/${Routes.DASHBOARDS}/${Pages.ACCOUNT}`,
        icon: Settings,
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
                <span className="text-base font-semibold">{tParent('title')}</span>
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
