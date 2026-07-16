'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCapacityRequest } from '@/features/capacity-requests'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ParentCapacityRequestDialog({ open, onOpenChange }: Props) {
  const t = useTranslations('evaluations.capacityRequests')
  const [requestedCapacity, setRequestedCapacity] = useState('1')
  const [notes, setNotes] = useState('')
  const mutation = useCreateCapacityRequest()

  const handleSubmit = async () => {
    const capacity = Number(requestedCapacity)
    if (!Number.isFinite(capacity) || capacity < 1) {
      showErrorToast({ raw: t('invalidCapacity') })
      return
    }

    try {
      await mutation.mutateAsync({ requestedCapacity: capacity, notes: notes || undefined })
      showSuccessToast({ raw: t('requestSubmitted') })
      onOpenChange(false)
      setNotes('')
      setRequestedCapacity('1')
    } catch {
      showErrorToast({ raw: t('requestFailed') })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('requestTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestedCapacity">{t('columnRequestedCapacity')}</Label>
            <Input
              id="requestedCapacity"
              type="number"
              min={1}
              max={10}
              value={requestedCapacity}
              onChange={(e) => setRequestedCapacity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t('columnNotes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {t('submitRequest')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
