'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { Mail, Gift } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { sendVerificationEmail } from '@/features/mailer'

export default function EmailVerificationPage() {
  const t = useTranslations('verifyEmail')
  const { data: session, status } = useSession()

  const email = session?.user?.email
  const userId = session?.user?.id

  const [sending, setSending] = useState(false)
  const [sended, setSended] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const sendEmail = useCallback(async () => {
    if (!email || !userId) return

    try {
      setSending(true)
      await sendVerificationEmail({ email, userId })
      setSended(true)
      setCooldown(60) // 60 ثانية
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
      showErrorToast({ raw: t('sendFailed') })
    } finally {
      setSending(false)
    }
  }, [email, userId])

  // إرسال أول مرة تلقائي
  useEffect(() => {
    if (status === 'authenticated' && email && userId && !sended) {
      void sendEmail()
    }
  }, [status, email, userId, sended, sendEmail])

  // toast مرة واحدة
  useEffect(() => {
    if (sended) {
      showSuccessToast({ raw: t('sendSuccess') })
    }
  }, [sended])

  // countdown للـ cooldown
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

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
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {t('sentLink')}{' '}
                  <span className="font-medium text-foreground">{email || t('fallbackEmail')}</span>
                </p>
                <p>{t('instruction')}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild variant="secondary" className="h-11 rounded-xl">
                  <a href="https://mail.google.com/" target="_blank">
                    <Mail />
                    {t('openGmail')}
                  </a>
                </Button>

                <Button asChild variant="secondary" className="h-11 rounded-xl">
                  <a href="https://outlook.live.com/mail/" target="_blank">
                    <Gift />
                    {t('openOutlook')}
                  </a>
                </Button>
              </div>

              <Button
                asChild
                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
              >
                <Link href={`/auth/login`}>{t('backToLogin')}</Link>
              </Button>

              <Button
                onClick={sendEmail}
                disabled={sending || cooldown > 0}
                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
              >
                {sending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t('sending')}
                  </>
                ) : cooldown > 0 ? (
                  t('resendIn', { cooldown })
                ) : (
                  t('resend')
                )}
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
                <p className="mt-2 text-sm text-muted-foreground">{t('clickLink')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
