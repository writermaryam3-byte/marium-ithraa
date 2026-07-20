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

const ENRICHER_URL = `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`

export function EnricherSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const t = useTranslations('navigation.dashboard')
  const tEnricher = useTranslations('deals.enricher')
  const tNotif = useTranslations('notifications')

  const data = {
    user: {
      name: session?.user.name || '',
      email: session?.user.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: t('dashboard'),
        url: ENRICHER_URL,
        icon: LayoutDashboard,
      },
      {
        title: tEnricher('deals'),
        url: `${ENRICHER_URL}/${Pages.DEALS}`,
        icon: FileText,
      },
      {
        title: tEnricher('proposals'),
        url: `${ENRICHER_URL}/${Pages.PROPOSALS}`,
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
              <a href={ENRICHER_URL}>
                <span className="text-base font-semibold">{tEnricher('brand')}</span>
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
