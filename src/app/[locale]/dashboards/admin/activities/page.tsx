'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  useActivitiesWithDeals,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import type { Activity } from '@/features/deals'

export default function AdminActivitiesPage() {
  const locale = useLocale()
  const t = useTranslations('activities')
  const tCommon = useTranslations('common')
  const { data, isLoading } = useActivitiesWithDeals()
  const create = useCreateActivity()
  const update = useUpdateActivity()
  const del = useDeleteActivity()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Activity | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null)
  const [name, setName] = useState('')

  const activities = Array.isArray(data) ? data : []

  const handleCreate = async () => {
    if (!name.trim()) return
    await create.mutateAsync(name.trim())
    setName('')
    setCreateOpen(false)
  }

  const handleEdit = async () => {
    if (!editTarget || !name.trim()) return
    await update.mutateAsync({ id: editTarget.id, name: name.trim() })
    setEditTarget(null)
    setName('')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await del.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  const openEdit = (a: Activity) => {
    setName(a.name)
    setEditTarget(a)
  }

  const pageShell = (content: React.ReactNode) => (
    <>
      <SiteHeader titleKey="navigation.dashboard.activities" />
      <div className="flex flex-1 flex-col" dir={getTextDirection(locale)}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">{content}</div>
        </div>
      </div>
    </>
  )

  if (isLoading) {
    return pageShell(
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>,
    )
  }

  return pageShell(
    <>
      <Card className="rounded-2xl border-amber-50/70 bg-white/80 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-start">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="size-5 text-fuchsia-600" />
              {t('title')}
            </CardTitle>
            <CardDescription>{t('messages.subtitle')}</CardDescription>
          </div>
          <Button
            className="rounded-xl"
            onClick={() => {
              setName('')
              setCreateOpen(true)
            }}
          >
            <Plus className="size-4 me-2" />
            {t('actions.create')}
          </Button>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">{t('messages.empty')}</p>
              <Button
                className="mt-4 rounded-xl"
                variant="outline"
                onClick={() => {
                  setName('')
                  setCreateOpen(true)
                }}
              >
                <Plus className="size-4 me-2" />
                {t('actions.create')}
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('fields.name')}</TableHead>
                    <TableHead>{t('fields.dealsCount')}</TableHead>
                    <TableHead className="text-end">{t('table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{a.deals?.length ?? 0}</Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="inline-flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={tCommon('buttons.edit')}
                            onClick={() => openEdit(a)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={tCommon('buttons.delete')}
                            onClick={() => setDeleteTarget(a)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('dialogs.createTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>{t('fields.name')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fields.namePlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false)
                setName('')
              }}
            >
              {tCommon('buttons.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={create.isPending || !name.trim()}>
              {create.isPending ? tCommon('states.saving') : tCommon('buttons.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => {
          if (!o) {
            setEditTarget(null)
            setName('')
          }
        }}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('dialogs.editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>{t('fields.name')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fields.namePlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditTarget(null)
                setName('')
              }}
            >
              {tCommon('buttons.cancel')}
            </Button>
            <Button onClick={handleEdit} disabled={update.isPending || !name.trim()}>
              {update.isPending ? tCommon('states.saving') : tCommon('buttons.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null)
        }}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('dialogs.deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('dialogs.deleteConfirm', { name: deleteTarget?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {tCommon('buttons.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={del.isPending}>
              {del.isPending ? tCommon('states.deleting') : tCommon('buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>,
  )
}
