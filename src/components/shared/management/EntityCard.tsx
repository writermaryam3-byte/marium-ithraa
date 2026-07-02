// "use client"

// import * as React from "react"

// import { cn } from "@/lib/utils"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Button variant="gradient" } from "@/components/shared/management/Button variant="gradient""

// export type EntityCardField = {
//   label: string
//   value: React.ReactNode
//   icon?: React.ReactNode
//   valueClassName?: string
// }

// export type EntityCardProps = {
//   fields: EntityCardField[]
//   onEdit?: () => void
//   onDelete?: () => void
//   editLabel: string
//   deleteLabel: string
//   className?: string
// }

// export function EntityCard({
//   fields,
//   onEdit,
//   onDelete,
//   editLabel,
//   deleteLabel,
//   className,
// }: EntityCardProps) {
//   return (
//     <Card className={cn("rounded-2xl border bg-card shadow-sm", className)}>
//       <CardContent className="p-5">
//         <div className="space-y-2 text-start">
//           {fields.map((f) => (
//             <div key={f.label} className="flex items-center justify-start gap-2 text-sm">
//               {f.icon ? <span className="text-muted-foreground [&_svg]:size-4">{f.icon}</span> : null}
//               <span className="font-semibold text-foreground">{f.label}:</span>
//               <span className={cn("text-muted-foreground", f.valueClassName)}>{f.value}</span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 grid grid-cols-2 gap-3">
//           <Button
//             type="button"
//             variant="outline"
//             className="rounded-xl border-fuchsia-500/60 text-fuchsia-600 hover:bg-fuchsia-50"
//             onClick={onDelete}
//           >
//             {deleteLabel}
//           </Button>
//           <Button variant="gradient" type="button" className="rounded-xl" onClick={onEdit}>
//             {editLabel}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// ─── Types ────────────────────────────────────────────────────────────────────

export type EntityCardField = {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  valueClassName?: string
}

/** كل dialog بتاخد open + onClose بس — الـ consumer هو اللي يحط الـ content */
export type DialogRenderProps = {
  open: boolean
  onClose: () => void
}

export type EntityCardProps = {
  fields: EntityCardField[]
  editLabel: string
  deleteLabel: string
  className?: string

  // Render props — اختياريين لو مش محتاج dialog
  renderEditDialog?: (props: DialogRenderProps) => React.ReactNode
  renderDeleteDialog?: (props: DialogRenderProps) => React.ReactNode

  // لو عايز تتحكم في الـ open state من بره
  editOpen?: boolean
  deleteOpen?: boolean
  onEditOpenChange?: (open: boolean) => void
  onDeleteOpenChange?: (open: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

const EntityCardImpl = function EntityCard({
  fields,
  editLabel,
  deleteLabel,
  className,
  renderEditDialog,
  renderDeleteDialog,
  editOpen: editOpenProp,
  deleteOpen: deleteOpenProp,
  onEditOpenChange,
  onDeleteOpenChange,
}: EntityCardProps) {
  // Internal state — يُستخدم لو مفيش controlled state من بره
  const [editOpenInternal, setEditOpenInternal] = React.useState(false)
  const [deleteOpenInternal, setDeleteOpenInternal] = React.useState(false)

  // Controlled vs uncontrolled pattern
  const editOpen = editOpenProp ?? editOpenInternal
  const deleteOpen = deleteOpenProp ?? deleteOpenInternal

  const setEditOpen = (v: boolean) => {
    onEditOpenChange?.(v)
    setEditOpenInternal(v)
  }
  const setDeleteOpen = (v: boolean) => {
    onDeleteOpenChange?.(v)
    setDeleteOpenInternal(v)
  }

  return (
    <>
      <Card className={cn('rounded-2xl border bg-card shadow-sm', className)}>
        <CardContent className="p-5">
          {/* Fields */}
          <div className="space-y-2 text-start">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-start gap-2 text-sm">
                {f.icon ? (
                  <span className="text-muted-foreground [&_svg]:size-4">{f.icon}</span>
                ) : null}
                <span className="font-semibold text-foreground">{f.label}:</span>
                <span className={cn('text-muted-foreground', f.valueClassName)}>{f.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-destructive/60 text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteOpen(true)}
            >
              {deleteLabel}
            </Button>
            <Button
              variant="gradient"
              type="button"
              className="rounded-xl"
              onClick={() => setEditOpen(true)}
            >
              {editLabel}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog — render prop */}
      {renderEditDialog?.({ open: editOpen, onClose: () => setEditOpen(false) })}

      {/* Delete Dialog — render prop */}
      {renderDeleteDialog?.({ open: deleteOpen, onClose: () => setDeleteOpen(false) })}
    </>
  )
}

export const EntityCard = React.memo(EntityCardImpl)
