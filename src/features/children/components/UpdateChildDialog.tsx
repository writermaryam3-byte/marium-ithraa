'use client'

import { useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { Loader2 } from 'lucide-react'
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
import { Form } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { updateChildSchema } from '@/features/forms/schemas/child.schema'
import { FormTypes, Gender, StatusCode } from '@/lib/types/enums'

import { updateChildAction } from '../actions/update-child.action'

type UpdateChildDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  childId: string
  childName: string
  birthDate: string
  gender: Gender
}

export function UpdateChildDialog({
  open,
  onOpenChange,
  childId,
  childName,
  birthDate,
  gender,
}: UpdateChildDialogProps) {
  const t = useTranslations('Dashboard.Children')
  const tCommon = useTranslations('Dashboard.common')
  const { fields } = useFormConfig(FormTypes.CHILD_UPDATE)

  const { form, submit, isPending } = useServerActionForm({
    schema: updateChildSchema,
    defaultValues: {
      id: childId,
      name: childName,
      birthDate,
      gender,
    },
    action: updateChildAction,
    onStatusChange: (state) => {
      if (state.status === StatusCode.OK) {
        showSuccessToast(t, state.message ?? 'toast.saved')
        onOpenChange(false)
        return
      }
      if (state.status && state.message) showErrorToast(t, state.message)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dialog.editTitle')}</DialogTitle>
          <DialogDescription>{t('dialog.editDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => submit(values, { id: childId }))}
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  {tCommon('cancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
                disabled={isPending}
              >
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
  )
}
