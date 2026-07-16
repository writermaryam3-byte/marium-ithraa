'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle, ClipboardList } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Deal } from '@/features/deals/types'
import { useCloseDeal, useRecordDealAttendance } from '@/features/deals/hooks'

type Props = {
  dealId: string
  deal: Deal
}

export function DealExecutionPanel({ dealId, deal }: Props) {
  const t = useTranslations('deals')
  const recordAttendance = useRecordDealAttendance(dealId)
  const close = useCloseDeal(dealId)
  const [studentsAttended, setStudentsAttended] = useState(
    deal.studentsAttended != null ? String(deal.studentsAttended) : '',
  )
  const [notes, setNotes] = useState(deal.attendanceNotes ?? '')

  if (deal.status !== 'EXECUTING') {
    return null
  }

  const attendanceRecorded = deal.attendanceRecordedAt != null && deal.studentsAttended != null

  return (
    <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <ClipboardList className="size-4" />
          {t('executionTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {attendanceRecorded ? (
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">{t('studentsAttended')}: </span>
              {deal.studentsAttended}
            </p>
            {deal.attendanceNotes && (
              <p>
                <span className="text-muted-foreground">{t('attendanceNotes')}: </span>
                {deal.attendanceNotes}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {t('recordedAt')}: {new Date(deal.attendanceRecordedAt!).toLocaleString()}
            </p>
            <Button onClick={() => close.mutate()} disabled={close.isPending}>
              <CheckCircle className="size-4 me-1" />
              {close.isPending ? t('closing') : t('closeDeal')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground">{t('executionDesc')}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('studentsAttended')}</label>
                <Input
                  type="number"
                  min={0}
                  max={deal.studentsCount}
                  value={studentsAttended}
                  onChange={(e) => setStudentsAttended(e.target.value)}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">{t('attendanceNotes')}</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('attendanceNotesPlaceholder')}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                const count = Number(studentsAttended)
                if (!Number.isFinite(count) || count < 0) return
                recordAttendance.mutate({
                  studentsAttended: count,
                  notes: notes.trim() || undefined,
                })
              }}
              disabled={recordAttendance.isPending}
            >
              {recordAttendance.isPending ? t('recording') : t('recordAttendance')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
