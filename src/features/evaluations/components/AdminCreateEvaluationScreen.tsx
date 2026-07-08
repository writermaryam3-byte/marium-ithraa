'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { showErrorToast, showSuccessToast } from '@/lib/toast/app-toast'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createEvaluationSchema,
  type CreateEvaluationDto,
  type EvaluationType,
} from '@/features/evaluations/types'
import { useCreateEvaluation } from '@/features/evaluations/hooks'
import { EVALUATION_TYPE_LABELS } from '@/features/evaluations/utils/labels'

type Props = { locale: string }

const defaultDimension = () => ({
  name: '',
  code: '',
  minScore: 0,
  maxScore: 10,
  interpretationRules: null as Record<string, unknown> | null,
})

const defaultAnswer = () => ({ text: '', scoreValue: 1, code: '' })

const defaultQuestion = () => ({
  content: '',
  dimensionCode: '',
  order: 1,
  answers: [defaultAnswer(), { ...defaultAnswer(), scoreValue: 2 }],
})

export function AdminCreateEvaluationScreen({ locale }: Props) {
  const t = useTranslations('evaluations')
  const isAr = locale === 'ar'
  const router = useRouter()
  const create = useCreateEvaluation()

  const form = useForm<CreateEvaluationDto>({
    resolver: zodResolver(createEvaluationSchema),
    defaultValues: {
      title: '',
      type: 'multiple_intelligences',
      institutionId: '',
      ageFrom: null,
      ageTo: null,
      evaluatorTypes: [],
      dimensions: [defaultDimension()],
      questions: [defaultQuestion()],
    },
  })

  const dimensions = useFieldArray({ control: form.control, name: 'dimensions' })
  const questions = useFieldArray({ control: form.control, name: 'questions' })

  const dimensionCodes = form
    .watch('dimensions')
    .map((d) => d.code)
    .filter(Boolean)

  const applyTemplate = (
    qIndex: number,
    template: 'likert4' | 'likert5' | 'holland' | 'learning',
  ) => {
    const templates = {
      likert4: [1, 2, 3, 4].map((n) => ({
        text: String(n),
        scoreValue: n,
        code: String(n),
      })),
      likert5: [1, 2, 3, 4, 5].map((n) => ({
        text: String(n),
        scoreValue: n,
        code: String(n),
      })),
      holland: [
        { text: isAr ? 'نعم' : 'Yes', scoreValue: 2, code: 'yes' },
        { text: isAr ? 'لا' : 'No', scoreValue: 1, code: 'no' },
      ],
      learning: [
        { text: 'A', scoreValue: 1, code: 'A' },
        { text: 'B', scoreValue: -1, code: 'B' },
      ],
    }
    form.setValue(`questions.${qIndex}.answers`, templates[template])
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await create.mutateAsync(values)
      showSuccessToast(t, 'createSuccess')
      router.push('/dashboards/admin/evaluations')
    } catch (e: unknown) {
      showErrorToast({ error: e })
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 px-4 lg:px-6 max-w-4xl"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('create')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>{t('title')}</Label>
            <Input {...form.register('title')} />
          </div>
          <div className="space-y-2">
            <Label>{t('type')}</Label>
            <Select
              value={form.watch('type')}
              onValueChange={(v) => form.setValue('type', v as EvaluationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EVALUATION_TYPE_LABELS) as EvaluationType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {isAr ? EVALUATION_TYPE_LABELS[type].ar : EVALUATION_TYPE_LABELS[type].en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('institutionId')}</Label>
            <Input {...form.register('institutionId')} placeholder="uuid" />
          </div>
          <div className="space-y-2">
            <Label>{t('ageFrom')}</Label>
            <Input type="number" {...form.register('ageFrom', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>{t('ageTo')}</Label>
            <Input type="number" {...form.register('ageTo', { valueAsNumber: true })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('dimensions')}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => dimensions.append(defaultDimension())}
          >
            <Plus className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {dimensions.fields.map((field, i) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder={t('dimensionName')}
                  {...form.register(`dimensions.${i}.name`)}
                />
                <Input
                  placeholder={t('dimensionCode')}
                  {...form.register(`dimensions.${i}.code`)}
                />
                <Input
                  type="number"
                  placeholder="min"
                  {...form.register(`dimensions.${i}.minScore`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  type="number"
                  placeholder="max"
                  {...form.register(`dimensions.${i}.maxScore`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <Textarea
                placeholder={t('interpretationRules')}
                className="font-mono text-xs min-h-20"
                defaultValue=""
                onChange={(e) => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : null
                    form.setValue(`dimensions.${i}.interpretationRules`, parsed)
                  } catch {
                    /* ignore invalid json while typing */
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => dimensions.remove(i)}
                disabled={dimensions.fields.length <= 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('questions')}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              questions.append({
                ...defaultQuestion(),
                order: questions.fields.length + 1,
              })
            }
          >
            <Plus className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.fields.map((field, qi) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3">
              <Textarea
                placeholder={t('questionContent')}
                {...form.register(`questions.${qi}.content`)}
              />
              <div className="flex flex-wrap gap-2">
                <Select
                  value={form.watch(`questions.${qi}.dimensionCode`)}
                  onValueChange={(v) => form.setValue(`questions.${qi}.dimensionCode`, v)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t('dimensionCode')} />
                  </SelectTrigger>
                  <SelectContent>
                    {dimensionCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  className="w-24"
                  {...form.register(`questions.${qi}.order`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => applyTemplate(qi, 'likert4')}
                >
                  Likert 1-4
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => applyTemplate(qi, 'likert5')}
                >
                  Likert 1-5
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => applyTemplate(qi, 'holland')}
                >
                  Holland
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => applyTemplate(qi, 'learning')}
                >
                  A/B
                </Button>
              </div>
              <QuestionAnswers form={form} qIndex={qi} t={t} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => questions.remove(qi)}
                disabled={questions.fields.length <= 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? t('saving') : t('create')}
      </Button>
    </form>
  )
}

function QuestionAnswers({
  form,
  qIndex,
  t,
}: {
  form: ReturnType<typeof useForm<CreateEvaluationDto>>
  qIndex: number
  t: ReturnType<typeof useTranslations>
}) {
  const answers = form.watch(`questions.${qIndex}.answers`) ?? []

  return (
    <div className="space-y-2">
      <Label>{t('answers')}</Label>
      {answers.map((_, ai) => (
        <div key={ai} className="flex gap-2">
          <Input
            placeholder={t('answerText')}
            {...form.register(`questions.${qIndex}.answers.${ai}.text`)}
          />
          <Input
            type="number"
            className="w-24"
            placeholder={t('scoreValue')}
            {...form.register(`questions.${qIndex}.answers.${ai}.scoreValue`, {
              valueAsNumber: true,
            })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              const current = form.getValues(`questions.${qIndex}.answers`)
              if (current.length <= 2) return
              form.setValue(
                `questions.${qIndex}.answers`,
                current.filter((_, idx) => idx !== ai),
              )
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const current = form.getValues(`questions.${qIndex}.answers`)
          form.setValue(`questions.${qIndex}.answers`, [...current, defaultAnswer()])
        }}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}
