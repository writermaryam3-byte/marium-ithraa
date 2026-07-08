'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

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
import { FormTypes, StatusCode } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

import { updateClassAction } from '../actions/update-class.action'

type UpdateClassDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  className: string
  gradeId?: string
  teacherId?: string
}

export function UpdateClassDialog({
  open,
  onOpenChange,
  classId,
  className: classNameValue,
  gradeId = '',
  teacherId = '',
}: UpdateClassDialogProps) {
  const t = useTranslations('organizations.classes.forms')
  const tCommon = useTranslations('common')

  const handleStatus = (state: InitialState) => {
    if (state.status === StatusCode.OK) {
      showSuccessToast(t, state.message ?? 'toast.saved')
      onOpenChange(false)
      return
    }
    if (state.status && state.message) {
      showErrorToast(t, state.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>{t('editDescription')}</DialogDescription>
        </DialogHeader>
        <ServerActionForm
          formType={FormTypes.CLASS_UPDATE}
          action={updateClassAction}
          hiddenFields={{ id: classId, name: classNameValue, gradeId, teacherId }}
          onStatusChange={handleStatus}
          defaultValues={{ id: classId, name: classNameValue, gradeId, teacherId }}
        >
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {tCommon('cancel')}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
            >
              <Loader2 className="me-2 h-4 w-4 animate-spin hidden in-[[disabled]]:inline" />
              {tCommon('saveChanges')}
            </Button>
          </DialogFooter>
        </ServerActionForm>
      </DialogContent>
    </Dialog>
  )
}
