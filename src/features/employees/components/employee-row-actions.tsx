"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import FormFields from "@/components/shared/forms/formFields"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { Employee } from "../types/interfaces"
import { updateEmployeeAction } from "../actions/update-employee.action"
import { deleteEmployeeAction, type DeleteEmployeeState } from "../actions/delete-employee.action"
import useFormFields from "@/hooks/useFormFields"
import { FormTypes, StatusCode } from "@/lib/types/enums"
import { toast } from "react-toastify"
import { InitialState } from "@/lib/types/types"

type Props = {
  employee: Employee
}

export function EmployeeRowActions({ employee }: Props) {
  const [updateDialogOpenState, setUpdateDialogOpenState] = useState(false)
  const [deleteDialogOpenState, setDeleteDialogOpenState] = useState(false)
  const { getFormFields } = useFormFields({ slug: FormTypes.EMPLOYEE })

  const [updateState, updateAction, isUpdating] = useActionState<
    InitialState,
    FormData
  >(updateEmployeeAction, {
    message: "",
    error: {},
    status: null,
    formData: null,
  },)

  const [deleteState, deleteAction, isDeleting] = useActionState<
    DeleteEmployeeState,
    FormData
  >(deleteEmployeeAction, { ok: false })

  useEffect(() => {
    if (deleteState.ok) {
      toast.success("تم حذف الموظف بنجاج")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeleteDialogOpenState(false)
    }
    else if(!deleteState.ok) toast.error(deleteState.error)
    if (updateState.status === StatusCode.OK) {
      toast.success("تم تعديل الموظف بنجاج")
      setUpdateDialogOpenState(false)

    }
    else if(updateState.status&&updateState.message) toast.error(updateState.message)

  }, [deleteState, updateState])


  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog onOpenChange={setUpdateDialogOpenState} open={updateDialogOpenState}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
          <form action={updateAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={employee.id} />
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update the employee information and save your changes.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              {getFormFields().map((field) => {
                if(field.name==="email"||field.name==="phone"||field.name==="password")return
                const fieldValue = updateState.formData?.get(field.name) as string

                return (

                  <FormFields key={field.name} defaultValue={fieldValue} {...field} error={updateState?.error || {}} />
                )
              })}
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isUpdating} className="h-11 rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95">
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpenState} onOpenChange={setDeleteDialogOpenState}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form action={deleteAction}>
            <input type="hidden" name="id" value={employee.id} />
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this employee? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteState?.error && (
              <p className="mt-2 text-sm text-destructive">{deleteState.error}</p>
            )}
            <DialogFooter className="mt-4">
              <Button type="submit" variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

