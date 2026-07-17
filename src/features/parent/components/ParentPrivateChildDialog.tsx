'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPrivateChildAction } from '@/features/children'
import { useFormConfig } from '@/features/forms'
import { useServerActionForm } from '@/features/forms/hooks/useServerActionForm'
import { RhfFormFields } from '@/features/forms/components/RhfFormFields'
import { createPrivateChildSchema } from '@/features/forms/schemas/child.schema'
import { isActionSuccess } from '@/features/forms/action-results'
import { useActionFeedback } from '@/hooks/useActionFeedback'
import { FormTypes, Gender } from '@/lib/types/enums'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCount: number
  maxChildren: number
  onSuccess: () => void
}

export function ParentPrivateChildDialog({
  open,
  onOpenChange,
  currentCount,
  maxChildren,
  onSuccess,
}: Props) {
  const t = useTranslations('children.forms')
  const tCommon = useTranslations('common')
  const { fields } = useFormConfig(FormTypes.CHILD_PRIVATE)
  const { notifyAction } = useActionFeedback()

  const { form, submit, isPending } = useServerActionForm({
    schema: createPrivateChildSchema,
    defaultValues: {
      name: '',
      birthDate: '',
      gender: Gender.MALE,
      currentCount,
    },
    action: createPrivateChildAction,
    onStatusChange: (state) => {
      if (isActionSuccess(state)) {
        notifyAction(state)
        onSuccess()
        onOpenChange(false)
        form.reset()
      } else if (state.message) {
        notifyAction(state)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addTitle')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              submit(values, { currentCount: String(currentCount) }),
            )}
            className="space-y-4"
          >
            <RhfFormFields fields={fields} />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('gender.label')}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('gender.placeholder')} />
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
              <Button type="submit" disabled={isPending} className="rounded-xl">
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
