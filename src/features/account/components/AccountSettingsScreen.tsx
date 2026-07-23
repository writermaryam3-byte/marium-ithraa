'use client'

import { BadgeCheck, Mail, Phone, Shield, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentUserClient } from '@/features/account/api'
import { ChangePasswordForm } from '@/features/account/components/ChangePasswordForm'
import { getPostLoginRedirect } from '@/features/auth/utils/redirects'
import { roleNames } from '@/features/auth/utils/rbac'
import type { IUserResponseDto } from '@/features/users/types'

type Props = {
  locale: string
}

function InfoRow({
  icon,
  label,
  value,
  verifiedLabel,
}: {
  icon: React.ReactNode
  label: string
  value: string
  verifiedLabel?: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-white/80 px-4 py-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value || '—'}</p>
        {verifiedLabel ? <p className="text-xs text-muted-foreground">{verifiedLabel}</p> : null}
      </div>
    </div>
  )
}

export function AccountSettingsScreen({ locale }: Props) {
  const t = useTranslations('account')
  const { data: session } = useSession()
  const [profile, setProfile] = useState<IUserResponseDto | null>(null)
  const [loading, setLoading] = useState(true)

  const dashboardHref = getPostLoginRedirect(session?.user?.roles, { locale })

  useEffect(() => {
    let cancelled = false

    void getCurrentUserClient()
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch(() => {
        if (!cancelled && session?.user) {
          setProfile({
            id: session.user.id,
            name: session.user.name ?? '',
            email: session.user.email ?? '',
            phone: session.user.phone ?? '',
            isEmailVerified: session.user.isEmailVerified,
            isPhoneVerified: session.user.isPhoneVerified,
            roles: session.user.roles ?? [],
          })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [session])

  const roles = profile ? roleNames(profile.roles).join(', ') : '—'

  return (
    <main className="app-container space-y-10 py-8">
      <ManagementPageHeader
        breadcrumbs={[
          { href: dashboardHref, label: t('breadcrumbDashboard') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Card className="max-w-3xl border-amber-50/70 shadow-sm">
        <CardHeader>
          <CardTitle>{t('profileTitle')}</CardTitle>
          <CardDescription>{t('profileDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {loading ? (
            <>
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </>
          ) : (
            <>
              <InfoRow icon={<User className="size-4" />} label={t('name')} value={profile?.name ?? ''} />
              <InfoRow
                icon={<Mail className="size-4" />}
                label={t('email')}
                value={profile?.email ?? ''}
                verifiedLabel={
                  profile?.isEmailVerified ? t('emailVerified') : t('emailNotVerified')
                }
              />
              <InfoRow
                icon={<Phone className="size-4" />}
                label={t('phone')}
                value={profile?.phone ?? ''}
                verifiedLabel={
                  profile?.isPhoneVerified ? t('phoneVerified') : t('phoneNotVerified')
                }
              />
              <InfoRow icon={<Shield className="size-4" />} label={t('roles')} value={roles} />
              {profile?.isEmailVerified ? (
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                    <BadgeCheck className="size-4" />
                    {t('emailVerified')}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <ChangePasswordForm />
    </main>
  )
}
