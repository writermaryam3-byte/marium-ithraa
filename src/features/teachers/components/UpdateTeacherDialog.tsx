'use client'

import { Loader2, Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ServerActionForm } from '@/features/forms'
import { useActionFeedback } from '@/hooks/useActionFeedback'
import { FormTypes, StatusCode } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

import { updateTeacherAction } from '../actions/update-teacher.action'

type UpdateTeacherDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacherId: string
  name: string
  email: string
  phone: string
  jobTitle: string
}

export function UpdateTeacherDialog({
  open,
  onOpenChange,
  teacherId,
  name,
  email,
  phone,
  jobTitle,
}: UpdateTeacherDialogProps) {
  const t = useTranslations('teachers.forms')
  const tCommon = useTranslations('common')
  const { notifyAction } = useActionFeedback()

  const handleStatus = (state: InitialState) => {
    if (state.status === StatusCode.OK) {
      notifyAction(state)
      onOpenChange(false)
      return
    }
    if (state.status && state.message) {
      notifyAction(state)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-150 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>{t('editDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground">{t('readOnlyContact')}</p>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span dir="ltr">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <span dir="ltr">{phone}</span>
          </div>
        </div>

        <ServerActionForm
          formType={FormTypes.TEACHER_UPDATE}
          action={updateTeacherAction}
          hiddenFields={{ id: teacherId }}
          onStatusChange={handleStatus}
          defaultValues={{ id: teacherId, name, jobTitle }}
        >
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {tCommon('buttons.cancel')}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
            >
              <Loader2 className="me-2 h-4 w-4 animate-spin hidden in-[[disabled]]:inline" />
              {tCommon('buttons.save')}
            </Button>
          </DialogFooter>
        </ServerActionForm>
      </DialogContent>
    </Dialog>
  )
}
