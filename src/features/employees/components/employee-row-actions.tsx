'use client'

import { useActionState, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { isActionSuccess } from '@/features/forms/action-results'
import { useActionFeedback } from '@/hooks/useActionFeedback'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ServerActionForm } from '@/features/forms'
import { FormTypes } from '@/lib/types/enums'
import type { InitialState } from '@/lib/types/types'

import { updateEmployeeAction } from '../actions/update-employee.action'
import { deleteEmployeeAction, type DeleteEmployeeState } from '../actions/delete-employee.action'
import type { Employee } from '../types/interfaces'

type Props = {
  employee: Employee
}

export function EmployeeRowActions({ employee }: Props) {
  const t = useTranslations('Forms.Employee')
  const tCommon = useTranslations('Dashboard.common')
  const { notifyAction, notifyDelete } = useActionFeedback()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteEmployeeState, FormData>(
    deleteEmployeeAction,
    { success: false },
  )

  useEffect(() => {
    if (!deleteOpen) return
    if (deleteState.success) {
      notifyDelete(deleteState, 'Actions.employees.deleted')
      setDeleteOpen(false)
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, deleteOpen, notifyDelete])

  const handleUpdateStatus = (state: InitialState) => {
    if (isActionSuccess(state)) {
      notifyAction(state)
      setUpdateOpen(false)
      return
    }
    if (state.message) notifyAction(state)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editTitle')}</DialogTitle>
            <DialogDescription>{t('editDescription')}</DialogDescription>
          </DialogHeader>
          <ServerActionForm
            formType={FormTypes.EMPLOYEE_UPDATE}
            action={updateEmployeeAction}
            hiddenFields={{ id: employee.id }}
            defaultValues={{
              id: employee.id,
              name: employee.user.name,
              job_title: employee.job_title,
            }}
            onStatusChange={handleUpdateStatus}
          >
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="h-11 rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
              >
                {tCommon('saveChanges')}
              </Button>
            </DialogFooter>
          </ServerActionForm>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form action={deleteAction}>
            <input type="hidden" name="id" value={employee.id} />
            <DialogHeader>
              <DialogTitle>{t('deleteTitle')}</DialogTitle>
              <DialogDescription>{t('deleteDescription')}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button type="submit" variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {tCommon('deleting')}
                  </>
                ) : (
                  tCommon('delete')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
