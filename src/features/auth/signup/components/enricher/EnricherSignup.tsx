"use client"
import FormFields from "@/components/shared/forms/formFields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field"
import { enricherSignup } from "@/features/enricher/actions/enricherSignup";
import useFormFields from "@/hooks/useFormFields";
import { signInWithPhoneAndRedirect } from "@/lib/auth/signInWithCredentials";
import { FormTypes, StatusCode } from "@/lib/types/enums";
import { InitialState } from "@/lib/types/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export const EnricherSignup = () => {
    const { getFormFields } = useFormFields({ slug: FormTypes.ENRICHER })
    const router = useRouter()

    const [state, formAction, isPending] = useActionState<InitialState, FormData>(
        enricherSignup,
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
          toast.success(state.message);
      
          const login = async () => {
            try {
                console.log(state.formData?.get("phone"))
              const res = await signInWithPhoneAndRedirect({
            
                phone: state.formData?.get("phone")?.toString().trim() || "",
                password: state.formData?.get("password")?.toString() || "",
                push: router.push,
              });
      
              console.log(res, "as res");
      
              if (!res.ok) {
                console.log(res.error)
                toast.error("حدث خطأ ما أثناء تسجيل الدخول");
              }
            } catch {
              toast.error("حدث خطأ ما أثناء تسجيل الدخول");
            }
          };
      
          login();
        } else if (state.status && state.message) {
          toast.error(state.message);
        }
      }, [state.status, router, state]);
    return (
        <form className="flex flex-col gap-4" action={formAction}>

            <FieldGroup>
                {getFormFields().map((field) => {
                    const fieldValue = state.formData?.get(field.name) as string
                    return (
                        <FormFields key={field.name} {...field} defaultValue={fieldValue} error={state?.error || {}} />
                    )
                })}
            </FieldGroup>
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
        </form>
    )
}

