'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { TestCreationForm } from './TestCreationForm'

export function AddTestDialog() {
  const t = useTranslations('Features.Tests')
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          <span className="hidden lg:inline">{t('Actions.Add')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Actions.Add')}</DialogTitle>
        </DialogHeader>
        <TestCreationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
