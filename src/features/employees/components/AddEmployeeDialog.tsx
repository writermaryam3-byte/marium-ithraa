"use client"
import FormFields from "@/components/shared/forms/formFields"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import useFormFields from "@/hooks/useFormFields"
import { FormTypes, StatusCode } from "@/lib/types/enums"
import { IconPlus } from "@tabler/icons-react"
import { Loader2 } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { createEmployeeAction } from "../actions/create-employee.action"
import { type InitialState } from "@/lib/types/types"
import { toast } from "react-toastify"

export function AddEmployeeDialog() {
    const { getFormFields } = useFormFields({ slug: FormTypes.EMPLOYEE })
    const [isOpenState, setIsOpenState] = useState(false)
    const [state, formAction, isPending] = useActionState<InitialState, FormData>(
        createEmployeeAction,
        {
            message: "",
            error: {},
            status: null,
            formData: null,
        },
    )
    useEffect(() => {
        if (!state?.status) return;

        if (state.status === StatusCode.CREATED) {
            toast.success(state?.message);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOpenState(false)
        } else if (state.status && state.message) {
            toast.error(state.message);
        }

    }, [state.message, state.status]);
    return (
        <Dialog open={isOpenState} onOpenChange={setIsOpenState}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Employee</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
                <form className="flex flex-col gap-4" action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <input
                            type="hidden"
                            name="organization_id"
                            value="e5de0d32-285b-4d30-8497-f80a20ea52d4"
                        />
                        {getFormFields().map((field) => {
                            const fieldValue = state.formData?.get(field.name) as string
                            return (
                                <FormFields key={field.name} {...field} defaultValue={fieldValue} error={state?.error || {}} />
                            )
                        })}
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    adding
                                </>
                            ) : (
                                "Add"
                            )}
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
