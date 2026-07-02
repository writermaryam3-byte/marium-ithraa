'use client'

import * as React from 'react'
import {
  Brain,
  Database,
  LayoutDashboard,
  PanelTop,
  FileBarChart,
  Users,
  Briefcase,
  Activity,
} from 'lucide-react'

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
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Pages, Routes } from '@/lib/types/enums'

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const t = useTranslations()

  const data = {
    user: {
      name: session?.user.name || '',
      email: session?.user.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: t('Dashboard.Nav.dashboard'),
        url: ADMIN_URL,
        icon: LayoutDashboard,
      },
      {
        title: t('Dashboard.Nav.users'),
        url: `${ADMIN_URL}/${Pages.USERS}`,
        icon: Users,
      },
      {
        title: t('Features.Organizations.admin.nav'),
        url: `${ADMIN_URL}/organizations`,
        icon: Users,
      },
      {
        title: t('Dashboard.Nav.children'),
        url: `${ADMIN_URL}/children`,
        icon: Users,
      },
      {
        title: t('Dashboard.Nav.evaluations'),
        url: `${ADMIN_URL}/evaluations`,
        icon: Brain,
      },
      {
        title: t('Dashboard.Nav.attempts'),
        url: `${ADMIN_URL}/attempts`,
        icon: FileBarChart,
      },
      {
        title: t('Features.Notifications.title'),
        url: `/${Routes.DASHBOARDS}/notifications`,
        icon: FileBarChart,
      },
      {
        title: t('Features.Notifications.dispatchTitle'),
        url: `${ADMIN_URL}/notifications/dispatch`,
        icon: FileBarChart,
      },
      {
        title: t('Dashboard.Nav.activities'),
        url: `${ADMIN_URL}/activities`,
        icon: Activity,
      },
      {
        title: t('Dashboard.Nav.capacityRequests'),
        url: `${ADMIN_URL}/capacity-requests`,
        icon: Database,
      },
      {
        title: t('Dashboard.Nav.deals'),
        url: `${ADMIN_URL}/deals`,
        icon: Briefcase,
      },
    ],
    // navSecondary: [
    //   {
    //     title: t("Dashboard.Nav.settings"),
    //     url: "#",
    //     icon: Settings,
    //   },
    //   {
    //     title: t("Dashboard.Nav.getHelp"),
    //     url: "#",
    //     icon: HelpCircle,
    //   },
    // ],
    // documents: [
    //   {
    //     name: t("Dashboard.Nav.dataLibrary"),
    //     url: "#",
    //     icon: FileBarChart,
    //   },
    // ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <PanelTop className="size-5!" />
                <span className="text-base font-semibold">{'Admin'}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
