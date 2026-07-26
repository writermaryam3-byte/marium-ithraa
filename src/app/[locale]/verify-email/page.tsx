'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { verifyEmailClient } from '@/features/auth'
import { getLocalizedLoginPath, getPostLoginRedirect } from '@/features/auth/utils/redirects'

function VerifyEmailContent() {
  const t = useTranslations('verifyEmail')
  const params = useParams()
  const locale = params.locale as string
  const { data: session, update } = useSession()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    if (!token) return

    verifyEmailClient(token)
      .then(async (res) => {
        setResult(res)
        if (res.ok) {
          let roles = session?.user?.roles
          try {
            const updatedSession = await update({ isEmailVerified: true })
            roles = updatedSession?.user?.roles ?? roles
          } catch {
            // user might not be authenticated — redirect to login anyway
          }

          if (roles?.length) {
            window.location.href = getPostLoginRedirect(roles, {
              isEmailVerified: true,
              locale,
            })
          } else {
            window.location.href = getLocalizedLoginPath(locale)
          }
        }
      })
      .catch(() => {
        setResult({ ok: false, message: t('failed') })
      })
  }, [token, update, session, locale, t])

  const verifying = token !== null && result === null

  return (
    <main className="min-h-dvh pt-36 pb-16">
      <div className="app-container">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
          <Card className="mx-auto w-full max-w-md border-amber-50 shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={160}
                  height={48}
                  className="h-10 w-auto"
                  priority
                />
              </div>
              <CardTitle className="text-center text-2xl font-bold text-blue-500">
                {t('title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {verifying ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              ) : !token ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {t('missingToken')}
                </div>
              ) : result?.ok ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                  {result.message}
                </div>
              ) : (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {result?.message ?? t('failed')}
                </div>
              )}

              <Button
                asChild
                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
              >
                <Link href={`/auth/login`}>{t('goToLogin')}</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/20" />
              <div className="relative p-10">
                <Image
                  src="/hero.png"
                  alt="hero"
                  width={520}
                  height={520}
                  className="h-auto w-full"
                  priority
                />
                <p className="mt-6 text-lg font-semibold text-foreground">{t('almostDone')}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t('onceVerified')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
