'use client'

import { Loader2, UserCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useRouter } from '@/i18n/navigation'
import { Pages, Routes } from '@/lib/types/enums'

const dashboardMap: Record<string, string> = {
  ADMIN: `/${Routes.DASHBOARDS}/${Pages.ADMIN}`,
  ORGANIZATIONOWNER: `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`,
  TEACHER: `/${Routes.DASHBOARDS}/${Pages.TEACHER}`,
  PARENT: `/${Routes.DASHBOARDS}/${Pages.PARENT}`,
}

export default function ChooseRolePage() {
  const router = useRouter()
  const t = useTranslations('dashboard.choseRole')
  const { user, isAuthenticated, isLoading, loginPath, sessionExpired } = useAuth()
  const [loadingRoleId, setLoadingRoleId] = useState<string | null>(null)

  const roles = user?.roles ?? []

  useEffect(() => {
    if (isLoading || sessionExpired) return
    if (!isAuthenticated) {
      router.replace(loginPath)
    }
  }, [isAuthenticated, isLoading, loginPath, router, sessionExpired])

  const handleSelectRole = (roleName: string, roleId: string) => {
    setLoadingRoleId(roleId)
    const href = dashboardMap[roleName] ?? `/${Routes.DASHBOARDS}`
    router.push(href)
  }

  if (isLoading || sessionExpired || !isAuthenticated) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-fuchsia-600" />
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-linear-to-tr from-fuchsia-100 via-blue-50 to-indigo-50">
      <div className="w-full max-w-xl px-4 py-10">
        <Card className="border-blue-100 shadow-lg rounded-2xl bg-white/90">
          <CardHeader>
            <CardTitle className="mb-2 text-center text-2xl font-bold text-indigo-700 flex flex-col items-center">
              <UserCheck className="mb-2 text-fuchsia-600" size={36} />
              {t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="mb-2 text-center text-muted-foreground text-sm">{t('subtitle')}</div>
            <div className="grid gap-5 sm:grid-cols-2">
              {roles.length === 0 && (
                <p className="col-span-2 text-center text-gray-400">{t('noRoles')}</p>
              )}
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant="secondary"
                  className={`h-14 rounded-xl w-full justify-center text-lg font-semibold flex items-center gap-2 border-2 transition-all duration-150 ${
                    loadingRoleId === role.id
                      ? 'pointer-events-none opacity-70'
                      : 'hover:border-indigo-400 border-transparent'
                  }`}
                  onClick={() => handleSelectRole(role.name, role.id)}
                  disabled={loadingRoleId !== null}
                >
                  {loadingRoleId === role.id ? (
                    <>
                      <Loader2 className="me-2 animate-spin" />
                      {t('redirecting')}
                    </>
                  ) : (
                    role.name
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
