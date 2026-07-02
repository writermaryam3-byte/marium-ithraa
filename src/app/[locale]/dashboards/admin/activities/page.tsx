'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
  useActivitiesWithDeals,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from '@/features/deals'
import { getTextDirection } from '@/lib/i18n/locale-utils'
import type { Activity } from '@/features/deals'

export default function AdminActivitiesPage() {
  const locale = useLocale()
  const t = useTranslations('Features.Activities')
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

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6" dir={getTextDirection(locale)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <Button
          onClick={() => {
            setName('')
            setCreateOpen(true)
          }}
        >
          <Plus className="size-4 me-2" />
          {t('create')}
        </Button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{t('empty')}</p>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-3 font-medium">{t('name')}</th>
                <th className="text-start p-3 font-medium">{t('dealsCount')}</th>
                <th className="text-end p-3 font-medium">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="p-3">{a.name}</td>
                  <td className="p-3 text-muted-foreground">{a.deals?.length ?? '—'}</td>
                  <td className="p-3 text-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(a)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label>{t('name')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
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
              {t('cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={create.isPending || !name.trim()}>
              {create.isPending ? t('saving') : t('save')}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label>{t('name')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
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
              {t('cancel')}
            </Button>
            <Button onClick={handleEdit} disabled={update.isPending || !name.trim()}>
              {update.isPending ? t('saving') : t('save')}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('deleteConfirm', { name: deleteTarget?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={del.isPending}>
              {del.isPending ? t('deleting') : t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
