'use client'

import { useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { Loader2 } from 'lucide-react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
import { useFormConfig } from '@/features/forms/hooks/useFormConfig'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { createAdminChildSchema } from '@/features/forms/schemas/child.schema'
import { FormTypes, Gender, StatusCode } from '@/lib/types/enums'

import { createChildAction } from '../actions/create-child.action'

export function AddChildDialog() {
  const t = useTranslations('children')
  const tCommon = useTranslations('common')
  const { fields } = useFormConfig(FormTypes.CHILD_ADMIN)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const { form, submit, isPending } = useServerActionForm({
    schema: createAdminChildSchema,
    defaultValues: {
      name: '',
      grade: '',
      birthDate: '',
      gender: Gender.MALE,
      user_id: session?.user?.id ?? '',
    },
    action: createChildAction,
    onStatusChange: (state) => {
      if (state.status === StatusCode.CREATED) {
        showSuccessToast(t, state.message ?? 'toast.created')
        setIsOpen(false)
        form.reset()
        return
      }
      if (state.status && state.message) showErrorToast(t, state.message)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          <span className="hidden lg:inline">{t('actions.add')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dialog.addTitle')}</DialogTitle>
          <DialogDescription>{t('dialog.addDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              submit(values, { user_id: session?.user?.id ?? '' }),
            )}
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
                    {tCommon('adding')}
                  </>
                ) : (
                  tCommon('add')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
