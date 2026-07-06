'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useTranslateBackend } from '@/lib/i18n/backend-messages'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CheckCircle2, Loader2, Plus, UserRound } from 'lucide-react'
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ManagementPageHeader } from '@/components/shared/management/ManagementPageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { getChildByIdClient, requestChildTransfer } from '@/features/children/api'
import { useCreateChild, useParentSearch } from '@/features/children/hooks'
import type { Child, CreateChildResponse, ParentInfo } from '@/features/children'
import { type ClassItem } from '@/features/classes'
import { type Grade } from '@/features/grades'
import { useRouter } from '@/i18n/navigation'
import { Gender } from '@/lib/types/enums'
import { cn } from '@/lib/utils'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const createChildFlowSchema = z.object({
  parentPhone: z.string().trim().min(1, 'Parent phone is required'),
  parentName: z.string().trim().optional(),
  parentEmail: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  name: z.string().trim().min(1, 'Child name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  gradeId: z.string().min(1, 'Grade is required'),
  classId: z.string().min(1, 'Class is required'),
})

type CreateChildFlowValues = z.infer<typeof createChildFlowSchema>
type ChildState = 'selecting' | 'creating'

type Props = {
  locale: string
  organizationId: string
  grades: Grade[]
  classes: ClassItem[]
  initialGradeId?: string
  initialClassId?: string
}

export function CreateChildPage({
  locale,
  organizationId,
  grades,
  classes,
  initialGradeId = '',
  initialClassId = '',
}: Props) {
  const router = useRouter()
  const isAr = locale === 'ar'
  const t = useTranslations('CreateChild')
  const tb = useTranslateBackend()
  const [childState, setChildState] = useState<ChildState>('selecting')
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [selectionStatus, setSelectionStatus] = useState<
    'idle' | 'loading' | 'same' | 'transfer' | 'sent'
  >('idle')
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null)
  const [transferResponse, setTransferResponse] = useState<Extract<
    CreateChildResponse,
    { status: 'TRANSFER_REQUIRED' }
  > | null>(null)

  const form = useForm<CreateChildFlowValues>({
    resolver: zodResolver(createChildFlowSchema),
    defaultValues: {
      parentPhone: '',
      parentName: '',
      parentEmail: '',
      name: '',
      birthDate: '',
      gender: Gender.MALE,
      gradeId: initialGradeId,
      classId: initialClassId,
    },
  })

  const parentPhone = useWatch({ control: form.control, name: 'parentPhone' })
  const gradeId = useWatch({ control: form.control, name: 'gradeId' })
  const {
    parent,
    parentState,
    isSearching,
    error: parentSearchError,
    notParentUser,
  } = useParentSearch(parentPhone)
  const { createChild, isLoading } = useCreateChild({
    onCreated: () => {
      router.push('/dashboards/organization/children')
    },
    onTransferRequired: (response) => setTransferResponse(response),
    onConflict: (message) => setDuplicateMessage(message),
  })

  const classesForGrade = useMemo(
    () => classes.filter((item) => item.gradeId === gradeId),
    [classes, gradeId],
  )

  async function handleSelectChild(childId: string) {
    setSelectionStatus('loading')
    setSelectedChild(null)
    setDuplicateMessage(null)

    try {
      const response = await getChildByIdClient(childId)
      const child = response.child
      setSelectedChild(child)

      if (child.organizationId === organizationId) {
        setSelectionStatus('same')
        setDuplicateMessage(t('childAlreadyExists'))
        return
      }

      setSelectionStatus('transfer')
    } catch (err) {
      setSelectionStatus('idle')
      toast.error(err instanceof Error ? err.message : t('unableToLoadChild'))
    }
  }

  async function handleRequestTransfer() {
    if (!selectedChild) return

    setSelectionStatus('loading')
    try {
      await requestChildTransfer(selectedChild.id, 'organization', organizationId)
      setSelectionStatus('sent')
      toast.success(t('transferRequestSent'))
    } catch (err) {
      setSelectionStatus('transfer')
      toast.error(err instanceof Error ? err.message : t('unableToRequestTransfer'))
    }
  }

  function handleCreateSubmit(values: CreateChildFlowValues) {
    setDuplicateMessage(null)

    if (parentState === 'creating') {
      let hasParentError = false
      if (!values.parentName?.trim()) {
        form.setError('parentName', { message: t('validation.parentNameRequired') })
        hasParentError = true
      }

      if (hasParentError) return
    }

    if (parentState === 'not_parent') {
      if (!values.parentName?.trim()) {
        form.setError('parentName', { message: t('validation.parentNameRequired') })
        return
      }
    }

    createChild({
      name: values.name,
      birthDate: values.birthDate,
      gender: values.gender,
      classId: values.classId,
      parentPhone: values.parentPhone,
      parentEmail: values.parentEmail || parent?.email || notParentUser?.email || undefined,
      parentName: values.parentName || parent?.name || notParentUser?.name || undefined,
    })
  }

  const isCreatingChild = childState === 'creating' || parentState === 'creating'

  const canSubmit =
    (isCreatingChild || parentState === 'not_parent') &&
    parentState !== null &&
    selectionStatus !== 'same' &&
    selectionStatus !== 'sent'

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: '/dashboards/organization', label: t('breadcrumb.dashboard') },
          { href: '/dashboards/organization/children', label: t('breadcrumb.children') },
          { label: t('title') },
        ]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateSubmit)}
          className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">{t('parentIdentification')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ParentPhoneInput form={form} isSearching={isSearching} />

              {parentSearchError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {tb(parentSearchError)}
                </p>
              )}

              {isSearching && <ChildrenListSkeleton />}

              {!isSearching && parentState === 'found' && parent && (
                <ParentCard parent={parent}>
                  <ChildrenList
                    items={parent.children ?? []}
                    disabled={selectionStatus === 'loading' || selectionStatus === 'sent'}
                    onSelect={handleSelectChild}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full justify-center gap-2 rounded-lg"
                    onClick={() => {
                      setChildState('creating')
                      setSelectionStatus('idle')
                      setSelectedChild(null)
                      setDuplicateMessage(null)
                    }}
                  >
                    <Plus className="size-4" />
                    {t('addNewChild')}
                  </Button>
                </ParentCard>
              )}

              {!isSearching && parentState === 'creating' && <CreateParentFields form={form} />}

              {!isSearching && parentState === 'not_parent' && notParentUser && (
                <NotParentFields form={form} user={notParentUser} />
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {duplicateMessage && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {tb(duplicateMessage)}
              </p>
            )}

            {selectionStatus === 'transfer' && selectedChild && (
              <TransferAlert child={selectedChild} onRequestTransfer={handleRequestTransfer} />
            )}

            {selectionStatus === 'sent' && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {t('transferRequestSent')}
              </p>
            )}

            {isCreatingChild && (
              <ChildForm
                form={form}
                grades={grades}
                classesForGrade={classesForGrade}
                onGradeChange={(nextGradeId) => {
                  form.setValue('gradeId', nextGradeId, { shouldValidate: true })
                  form.setValue('classId', '', { shouldValidate: true })
                }}
              />
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                className="h-11 flex-1 rounded-lg"
                disabled={!canSubmit || isLoading}
              >
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {t('createChild')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg"
                onClick={() => router.push('/dashboards/organization/children')}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <TransferModal
        open={Boolean(transferResponse)}
        response={transferResponse}
        onOpenChange={(open) => {
          if (!open) setTransferResponse(null)
        }}
      />
    </main>
  )
}

function ParentPhoneInput({
  form,
  isSearching,
}: {
  form: UseFormReturn<CreateChildFlowValues>
  isSearching: boolean
}) {
  const t = useTranslations('CreateChild')
  return (
    <FormField
      control={form.control}
      name="parentPhone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('labels.parentPhone')}</FormLabel>
          <FormControl>
            <div className="relative">
              {/* <Input {...field} type="tel" className="h-11 rounded-lg pe-10" placeholder="+20..." /> */}
              <PhoneInput
                international
                defaultCountry="SA"
                placeholder={''}
                disabled={field.disabled}
                value={String(field.value ?? '')}
                onChange={(value) => field.onChange(value ?? '')}
                onBlur={field.onBlur}
                className={cn(
                  'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs',
                )}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 size-5 animate-spin text-muted-foreground" />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function ParentCard({ parent, children }: { parent: ParentInfo; children: ReactNode }) {
  const t = useTranslations('CreateChild')
  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <UserRound className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{parent.name || t('unnamedParent')}</p>
            <Badge className="bg-emerald-100 text-emerald-700" variant="secondary">
              <CheckCircle2 className="size-3" />
              {t('parentFound')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{parent.phone}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function ChildrenList({
  items,
  disabled,
  onSelect,
}: {
  items: Child[]
  disabled: boolean
  onSelect: (childId: string) => void
}) {
  const t = useTranslations('CreateChild')
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{t('noChildrenFound')}</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t('children')}</p>
      {items.map((child) => (
        <div
          key={child.id}
          className="flex items-center justify-between gap-3 rounded-lg border p-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{child.name}</p>
            <p className="text-xs text-muted-foreground">
              {child.birthDate || t('birthDateUnavailable')}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={disabled}
            onClick={() => onSelect(child.id)}
          >
            {t('selectChild')}
          </Button>
        </div>
      ))}
    </div>
  )
}

function CreateParentFields({ form }: { form: UseFormReturn<CreateChildFlowValues> }) {
  const t = useTranslations('CreateChild')
  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
      <p className="text-sm font-medium text-amber-800">{t('parentNotFound')}</p>
      <FormField
        control={form.control}
        name="parentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('labels.parentName')}</FormLabel>
            <FormControl>
              <Input {...field} className="h-11 rounded-lg bg-background" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="parentEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('labels.parentEmail')}</FormLabel>
            <FormControl>
              <Input {...field} type="email" className="h-11 rounded-lg bg-background" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ChildForm({
  form,
  grades,
  classesForGrade,
  onGradeChange,
}: {
  form: UseFormReturn<CreateChildFlowValues>
  grades: Grade[]
  classesForGrade: ClassItem[]
  onGradeChange: (gradeId: string) => void
}) {
  const t = useTranslations('CreateChild')
  const gradeId = useWatch({ control: form.control, name: 'gradeId' })

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-base">{t('newChild')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t('labels.childName')}</FormLabel>
              <FormControl>
                <Input {...field} className="h-11 rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.birthDate')}</FormLabel>
              <FormControl>
                <Input {...field} type="date" className="h-11 rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.gender')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-lg">
                    <SelectValue placeholder={t('selectGender')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>{t('male')}</SelectItem>
                  <SelectItem value={Gender.FEMALE}>{t('female')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gradeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.grade')}</FormLabel>
              <Select value={field.value} onValueChange={onGradeChange}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-lg">
                    <SelectValue placeholder={t('selectGrade')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.class')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!gradeId}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-lg">
                    <SelectValue placeholder={t('selectClass')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classesForGrade.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

function TransferAlert({
  child,
  onRequestTransfer,
}: {
  child: Child
  onRequestTransfer: () => void
}) {
  const t = useTranslations('CreateChild')
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="space-y-3">
          <div>
            <p className="font-semibold">{t('transferAlert')}</p>
            <p className="text-sm">{child.name}</p>
          </div>
          <Button type="button" className="rounded-lg" onClick={onRequestTransfer}>
            {t('requestTransfer')}
          </Button>
        </div>
      </div>
    </div>
  )
}

function TransferModal({
  open,
  response,
  onOpenChange,
}: {
  open: boolean
  response: Extract<CreateChildResponse, { status: 'TRANSFER_REQUIRED' }> | null
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('CreateChild')
  const tb = useTranslateBackend()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('childExistsDialog')}</DialogTitle>
          <DialogDescription>
            {response?.message ? tb(response.message) : t('transferCreated')}
          </DialogDescription>
        </DialogHeader>
        {response?.transferRequestId && (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {t('requestId', { id: response.transferRequestId })}
          </p>
        )}
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t('done')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function NotParentFields({
  form,
  user,
}: {
  form: UseFormReturn<CreateChildFlowValues>
  user: { id: string; name?: string; phone: string; email?: string }
}) {
  const t = useTranslations('CreateChild')
  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
      <p className="text-sm font-medium text-amber-800">{t('assignParentRole')}</p>
      <p className="text-sm text-muted-foreground">
        {t('assignParentDescription', { phone: user.phone })}
      </p>
      <FormField
        control={form.control}
        name="parentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('labels.parentName')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                defaultValue={user.name}
                className="h-11 rounded-lg bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="parentEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('labels.parentEmail')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                defaultValue={user.email}
                className="h-11 rounded-lg bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ChildrenListSkeleton() {
  return (
    <div className={cn('space-y-3 rounded-xl border p-4')}>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  )
}
