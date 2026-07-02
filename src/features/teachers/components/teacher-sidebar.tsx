'use client'

import * as React from 'react'
import { LayoutDashboard, Bell } from 'lucide-react'
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

const TEACHER_URL = `/${Routes.DASHBOARDS}/${Pages.TEACHER}`

export default function TeacherSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const t = useTranslations('Dashboard.Nav')
  const tTeacher = useTranslations('Features.TeacherDashboard')
  const tNotif = useTranslations('Features.Notifications')

  const data = {
    user: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: t('dashboard'),
        url: TEACHER_URL,
        icon: LayoutDashboard,
      },
      {
        title: tTeacher('classes'),
        url: `${TEACHER_URL}/classes`,
        icon: LayoutDashboard,
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
              <a href={TEACHER_URL}>
                <span className="text-base font-semibold">{tTeacher('brand')}</span>
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
