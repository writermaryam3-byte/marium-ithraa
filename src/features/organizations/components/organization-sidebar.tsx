'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Database,
  FileType,
  HelpCircle,
  PanelTop,
  FileBarChart,
  ArrowLeftRight,
  Search,
  Settings,
  Users,
  Briefcase,
} from 'lucide-react'

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
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
import { useTranslations } from 'next-intl'
import { Pages, Routes } from '@/lib/types/enums'
import { User } from '@/features/users'

const ORGANIZATIONURL = `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`

export function OrganizationSidebar({
  organization,
  ...props
}: React.ComponentProps<typeof Sidebar> & { organization: { user: User } }) {
  const tNav = useTranslations('navigation')

  const data = {
    user: {
      name: organization?.user.name || '',
      email: organization?.user.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: tNav('organization.home'),
        url: ORGANIZATIONURL,
        icon: LayoutDashboard,
      },
      {
        title: tNav('dashboard.employees'),
        url: `${ORGANIZATIONURL}/${Pages.EMPLOYEES}`,
        icon: Users,
      },
      {
        title: tNav('organization.results'),
        url: `${ORGANIZATIONURL}/results`,
        icon: FileBarChart,
      },
      {
        title: tNav('dashboard.childTransfers'),
        url: `${ORGANIZATIONURL}/child-transfers`,
        icon: ArrowLeftRight,
      },
      {
        title: tNav('dashboard.notifications'),
        url: `/${Routes.DASHBOARDS}/notifications`,
        icon: FileBarChart,
      },
      {
        title: tNav('organization.deals'),
        url: `${ORGANIZATIONURL}/${Pages.DEALS}`,
        icon: Briefcase,
      },
    ],
    navSecondary: [
      {
        title: tNav('dashboard.settings'),
        url: '#',
        icon: Settings,
      },
      {
        title: tNav('dashboard.getHelp'),
        url: '#',
        icon: HelpCircle,
      },
      {
        title: tNav('dashboard.search'),
        url: '#',
        icon: Search,
      },
    ],
    documents: [
      {
        name: tNav('dashboard.dataLibrary'),
        url: '#',
        icon: Database,
      },
      {
        name: tNav('dashboard.reports'),
        url: '#',
        icon: FileBarChart,
      },
      {
        name: tNav('dashboard.wordAssistant'),
        url: '#',
        icon: FileType,
      },
    ],
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <div>
                <PanelTop className="size-5!" />
                <span className="text-base font-semibold">{organization?.user.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
