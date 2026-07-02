'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
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
import { Form } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { updateChildSchema } from '@/features/forms/schemas/child.schema'
import { FormTypes, Gender } from '@/lib/types/enums'

import { type Child } from '../types/interfaces'
import { updateChildAction } from '../actions/update-child.action'
import { deleteChildAction, type DeleteChildState } from '../actions/delete-child.action'

type Props = {
  child: Child
}

export function ChildRowActions({ child }: Props) {
  const t = useTranslations('Dashboard.Children')
  const tCommon = useTranslations('Dashboard.common')
  const { notifyAction, notifyDelete } = useActionFeedback()
  const { fields } = useFormConfig(FormTypes.CHILD_UPDATE)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const defaultBirthDate = useMemo(() => {
    const d = child.birthDate ? new Date(child.birthDate) : null
    if (!d || Number.isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
  }, [child.birthDate])

  const { form, submit, isPending } = useServerActionForm({
    schema: updateChildSchema,
    defaultValues: {
      id: child.id,
      name: child.name,
      birthDate: defaultBirthDate,
      gender: (child.gender as Gender) ?? Gender.MALE,
    },
    action: updateChildAction,
    onStatusChange: (state) => {
      if (isActionSuccess(state)) {
        notifyAction(state)
        setUpdateOpen(false)
      } else if (state.message) {
        notifyAction(state)
      }
    },
  })

  const [deleteState, deleteAction, isDeleting] = useActionState<DeleteChildState, FormData>(
    deleteChildAction,
    { success: false },
  )

  useEffect(() => {
    if (!deleteOpen) return
    if (deleteState.success) {
      notifyDelete(deleteState, 'Actions.children.deleted')
      setDeleteOpen(false)
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, deleteOpen, notifyDelete])

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
            <DialogTitle>{t('dialog.editTitle')}</DialogTitle>
            <DialogDescription>{t('dialog.editDescription')}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => submit(values))}
              className="flex flex-col gap-4"
            >
              <RhfFormFields fields={fields} />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fields.gender')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('fields.genderPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>{t('gender.male')}</SelectItem>
                        <SelectItem value={Gender.FEMALE}>{t('gender.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isPending} className="h-11 rounded-xl">
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {tCommon('saving')}
                    </>
                  ) : (
                    tCommon('saveChanges')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
            <input type="hidden" name="id" value={child.id} />
            <DialogHeader>
              <DialogTitle>{t('dialog.deleteTitle')}</DialogTitle>
              <DialogDescription>{t('dialog.deleteDescription')}</DialogDescription>
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
