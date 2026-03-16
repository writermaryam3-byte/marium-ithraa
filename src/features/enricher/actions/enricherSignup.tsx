"use server"
import { createEnricher, CreateEnrichers } from "@/features/enricher";
import { StatusCode } from "@/lib/types/enums";
import { InitialState } from "@/lib/types/types";

export async function enricherSignup(prevState: InitialState, formData: FormData) {
    try {
        const payload = Object.fromEntries(
            [...formData.entries()].filter(([key]) => !key.startsWith("$"))
        ) as unknown as CreateEnrichers
        console.log("payload: ", payload)
        const res = await createEnricher(payload)
        console.log("res: ", await (res.json()))

        if (!res.ok) {
            if (res.status === StatusCode.BADREQUEST) {
                console.log("hi")
                return {
                    formData,
                    error: await res.json(),
                    status: StatusCode.BADREQUEST,
                }
            }
            if (res.status === StatusCode.CONFLICT) {
                return {
                    formData,
                    status: StatusCode.CONFLICT,
                    message: "الموظف موجود فعلا"

                }
            }
            return {
                formData,
                status: StatusCode.INTERNALSERVERERROR,
                message: "حدث حطا ما تواصل مع الدعم"

            }
        }

        return { status: StatusCode.CREATED, message: "تم تسجيل المثري بنجاح بنجاح", formData }
    } catch {
        return {
            formData,
            status: StatusCode.INTERNALSERVERERROR,
            message: "حدث حطا ما تواصل مع الدعم"
        }
    }
}