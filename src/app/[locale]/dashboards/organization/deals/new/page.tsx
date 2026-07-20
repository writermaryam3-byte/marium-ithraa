'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { showErrorToast } from '@/lib/toast/app-toast'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateDeal, useActivities } from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import { Pages, Routes } from '@/lib/types/enums'

const ORG_URL = `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`

export default function NewDealPage() {
  const locale = useLocale()
  const t = useTranslations('deals')
  const router = useRouter()
  const { data: activities, isLoading: loadingActivities } = useActivities()
  const create = useCreateDeal(() => {
    router.push(`${ORG_URL}/${Pages.DEALS}`)
  })

  const [activityId, setActivityId] = useState('')
  const [studentsCount, setStudentsCount] = useState('')
  const [deadline, setDeadline] = useState('')

  const activitiesList = Array.isArray(activities) ? activities : []

  const handleSubmit = async () => {
    const count = parseInt(studentsCount, 10)

    // 1. التحقق من الحقول الأساسية
    if (!activityId || !deadline || isNaN(count) || count <= 0) {
      showErrorToast(t, 'validationError')
      return
    }

    const selectedDate = new Date(deadline)
    const now = new Date()

    if (selectedDate <= now) {
      showErrorToast(t, 'pastDeadlineError')
      return
    }

    try {
      await create.mutateAsync({
        activityId,
        studentsCount: count,
        deadline: selectedDate.toISOString(),
      })
    } catch {
      showErrorToast(t, 'createError')
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    // لتعديل التوقيت ليناسب الـ ISO بدون فرق التوقيت الزمني للـ Input
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }
  if (loadingActivities) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-xl" dir={getTextDirection(locale)}>
      <h2 className="text-xl font-semibold">{t('createDeal')}</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('dealDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>{t('activity')}</Label>
            <Select value={activityId} onValueChange={setActivityId}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectActivity')} />
              </SelectTrigger>
              <SelectContent>
                {activitiesList.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t('studentsCount')}</Label>
            <Input
              type="number"
              value={studentsCount}
              onChange={(e) => setStudentsCount(e.target.value)}
              placeholder="10"
              min="1"
            />
          </div>

          <div className="space-y-1">
            <Label>{t('deadline')}</Label>
            <Input
              type="datetime-local"
              value={deadline}
              min={`${getMinDateTime()}`}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={create.isPending} className="w-full">
            {create.isPending ? t('creating') : t('publishDeal')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
