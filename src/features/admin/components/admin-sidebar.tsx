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
  ScrollText,
  CreditCard,
  Sparkles,
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
  const tNav = useTranslations('navigation')

  const data = {
    user: {
      name: session?.user.name || '',
      email: session?.user.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: tNav('dashboard.dashboard'),
        url: ADMIN_URL,
        icon: LayoutDashboard,
      },
      {
        title: tNav('dashboard.users'),
        url: `${ADMIN_URL}/${Pages.USERS}`,
        icon: Users,
      },
      {
        title: tNav('dashboard.organizations'),
        url: `${ADMIN_URL}/organizations`,
        icon: Users,
      },
      {
        title: tNav('dashboard.children'),
        url: `${ADMIN_URL}/children`,
        icon: Users,
      },
      {
        title: tNav('dashboard.evaluations'),
        url: `${ADMIN_URL}/evaluations`,
        icon: Brain,
      },
      {
        title: tNav('dashboard.attempts'),
        url: `${ADMIN_URL}/attempts`,
        icon: FileBarChart,
      },
      {
        title: tNav('dashboard.notifications'),
        url: `/${Routes.DASHBOARDS}/notifications`,
        icon: FileBarChart,
      },
      {
        title: tNav('dashboard.notificationsDispatch'),
        url: `${ADMIN_URL}/notifications/dispatch`,
        icon: FileBarChart,
      },
      {
        title: tNav('dashboard.activities'),
        url: `${ADMIN_URL}/activities`,
        icon: Activity,
      },
      {
        title: tNav('dashboard.capacityRequests'),
        url: `${ADMIN_URL}/capacity-requests`,
        icon: Database,
      },
      {
        title: tNav('dashboard.deals'),
        url: `${ADMIN_URL}/deals`,
        icon: Briefcase,
      },
      {
        title: tNav('dashboard.auditLogs'),
        url: `${ADMIN_URL}/audit-logs`,
        icon: ScrollText,
      },
      {
        title: tNav('dashboard.paymentsAdmin'),
        url: `${ADMIN_URL}/payments`,
        icon: CreditCard,
      },
      {
        title: tNav('dashboard.extraAttempts'),
        url: `${ADMIN_URL}/extra-attempts`,
        icon: Sparkles,
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
