'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDispatchNotification } from '@/features/notifications/hooks'
import type { NotificationDelivery, NotificationType } from '@/features/notifications/types'
import { Link } from '@/i18n/navigation'
import { ApiError } from '@/lib/errors/ApiError'

type Props = { locale: string }

const DELIVERY_OPTIONS: { value: NotificationDelivery; labelKey: string }[] = [
  { value: 'inapp', labelKey: 'deliveryInapp' },
  { value: 'email', labelKey: 'deliveryEmail' },
  { value: 'both', labelKey: 'deliveryBoth' },
  { value: 'verify_email', labelKey: 'deliveryVerifyEmail' },
]

function parseMetadataJson(raw: string): Record<string, unknown> | null | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error('INVALID_JSON')
  }

  if (parsed === null) return null
  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('INVALID_JSON_OBJECT')
  }

  return parsed as Record<string, unknown>
}

export function AdminDispatchNotificationScreen({ locale }: Props) {
  const t = useTranslations('notifications')
  const isAr = locale === 'ar'

  const dispatch = useDispatchNotification()

  const [delivery, setDelivery] = useState<NotificationDelivery>('inapp')
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<string>('')
  const [metadataRaw, setMetadataRaw] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId.trim() || !title.trim() || !message.trim()) {
      showErrorToast(t, 'requiredFields')
      return
    }

    let metadata: Record<string, unknown> | null | undefined
    try {
      metadata = parseMetadataJson(metadataRaw)
    } catch (err) {
      if (err instanceof Error && err.message === 'INVALID_JSON') {
        showErrorToast(t, 'metadataInvalidJson')
        return
      }
      showErrorToast(t, 'metadataInvalidObject')
      return
    }

    try {
      await dispatch.mutateAsync({
        delivery,
        userId: userId.trim(),
        email: email.trim() || undefined,
        title: title.trim(),
        message: message.trim(),
        type: (type.trim() || undefined) as NotificationType | undefined,
        metadata,
      })
      showSuccessToast({ raw: isAr ? 'تم إرسال الإشعار إلى قائمة الانتظار' : t('dispatchSuccess') })
      setTitle('')
      setMessage('')
      setMetadataRaw('')
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : t('loadError')
      showErrorToast({ raw: msg })
    }
  }

  return (
    <main className="min-h-screen bg-surface py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="app-container space-y-8">
        <ManagementPageHeader
          breadcrumbs={[
            { href: '/dashboards/admin', label: isAr ? 'الإدارة' : 'Admin' },
            { label: t('dispatchTitle') },
          ]}
          title={t('dispatchTitle')}
          subtitle={t('dispatchSubtitle')}
        />

        <Card className="max-w-2xl rounded-2xl border bg-white shadow-sm">
          <CardHeader className="border-b border-fuchsia-100/80 bg-white/80">
            <CardTitle className="text-base font-bold text-foreground">
              {t('dispatchFormTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delivery">{t('deliveryLabel')}</Label>
                <Select
                  value={delivery}
                  onValueChange={(v) => setDelivery(v as NotificationDelivery)}
                >
                  <SelectTrigger id="delivery" className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userId">{t('userId')}</Label>
                  <Input
                    id="userId"
                    className="rounded-xl"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    className="rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">{t('notificationTitle')}</Label>
                <Input
                  id="title"
                  className="rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t('notificationMessage')}</Label>
                <Textarea
                  id="message"
                  className="rounded-xl"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t('notificationType')}</Label>
                <Input
                  id="type"
                  className="rounded-xl"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="general"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metadata">{t('metadata')}</Label>
                <Textarea
                  id="metadata"
                  className="rounded-xl font-mono text-sm"
                  value={metadataRaw}
                  onChange={(e) => setMetadataRaw(e.target.value)}
                  rows={5}
                  placeholder='{"path":"/dashboards/parent"}'
                  dir="ltr"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-fuchsia-100/80 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-fuchsia-500/50 text-fuchsia-600"
                  asChild
                >
                  <Link href="/dashboards/admin">{t('cancel')}</Link>
                </Button>
                <Button
                  variant="gradient"
                  type="submit"
                  className="rounded-xl gap-2"
                  disabled={dispatch.isPending}
                >
                  <Send className="size-4" />
                  {dispatch.isPending ? t('sending') : t('dispatchSubmit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
