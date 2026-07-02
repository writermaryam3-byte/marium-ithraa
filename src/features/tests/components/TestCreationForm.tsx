'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  testWizardDefaultValues,
  testWizardSchema,
  type TestWizardFormValues,
} from '@/features/forms/schemas/test.schema'
import { isActionSuccess } from '@/features/forms/action-results'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'

import { createTestAction } from '../actions/create-test-action'

type Props = {
  onSuccess?: () => void
  className?: string
}

export function TestCreationForm({ onSuccess, className }: Props) {
  const t = useTranslations('Forms.Test')
  const tActions = useTranslations('Actions')
  const tWizard = useTranslations('Forms.Test.wizard')
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TestWizardFormValues>({
    resolver: zodResolver(testWizardSchema),
    defaultValues: testWizardDefaultValues,
    mode: 'onTouched',
  })

  const { fields: questions, append: appendQuestion } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const onSubmit = async (values: TestWizardFormValues) => {
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('title', values.title)
      fd.set('description', values.description)
      fd.set('questions', JSON.stringify(values.questions))

      const result = await createTestAction(
        { message: '', error: {}, status: null, formData: null },
        fd,
      )

      if (isActionSuccess(result)) {
        showSuccessToast(tActions, result.message ?? 'Actions.tests.created')
        form.reset(testWizardDefaultValues)
        setStep(1)
        onSuccess?.()
        return
      }

      if (result.message) showErrorToast(tActions, result.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        className={className}
        onSubmit={
          step === 1
            ? (event) => {
                event.preventDefault()
                void form.trigger(['title', 'description']).then((ok) => {
                  if (ok) setStep(2)
                })
              }
            : form.handleSubmit(onSubmit)
        }
      >
        {step === 1 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('title.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('title.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('description.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="max-h-[50vh] space-y-4 overflow-y-auto">
            {questions.map((question, qIndex) => (
              <QuestionBlock key={question.id} qIndex={qIndex} tWizard={tWizard} />
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => appendQuestion({ content: '', answers: [{ text: '', score: 0 }] })}
            >
              {tWizard('addQuestion')}
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              {tWizard('back')}
            </Button>
          )}
          <Button type="submit" className="ms-auto" disabled={isSubmitting}>
            {step === 1 ? tWizard('next') : tWizard('submit')}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

function QuestionBlock({
  qIndex,
  tWizard,
}: {
  qIndex: number
  tWizard: ReturnType<typeof useTranslations>
}) {
  const { control } = useFormContext<TestWizardFormValues>()
  const { fields: answers, append: appendAnswer } = useFieldArray({
    control,
    name: `questions.${qIndex}.answers`,
  })

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <FormField
        control={control}
        name={`questions.${qIndex}.content`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tWizard('questionLabel', { index: qIndex + 1 })}</FormLabel>
            <FormControl>
              <Input placeholder={tWizard('questionPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {answers.map((answer, aIndex) => (
        <div key={answer.id} className="flex gap-2">
          <FormField
            control={control}
            name={`questions.${qIndex}.answers.${aIndex}.text`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={tWizard('answerPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`questions.${qIndex}.answers.${aIndex}.score`}
            render={({ field }) => (
              <FormItem className="w-24">
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendAnswer({ text: '', score: 0 })}
      >
        {tWizard('addAnswer')}
      </Button>
    </div>
  )
}
