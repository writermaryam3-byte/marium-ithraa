"use server"
import { createEnricher, CreateEnrichers } from "@/features/enrichers";
import { ApiError } from "@/lib/errors/ApiError";
import { StatusCode } from "@/lib/types/enums";
import { InitialState } from "@/lib/types/types";

export async function enricherSignup(prevState: InitialState, formData: FormData) {
    try {
        const payload = Object.fromEntries(
            [...formData.entries()].filter(([key]) => !key.startsWith("$"))
        ) as unknown as CreateEnrichers
        console.log("payload: ", payload)
        await createEnricher(payload)


        return { status: StatusCode.CREATED, message: "تم تسجيل المثري بنجاح", formData }
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === StatusCode.BADREQUEST) {
                return {
                    formData,
                    error: error.validationErrors,
                    status: StatusCode.BADREQUEST,
                }
            }
            if (error.status === StatusCode.CONFLICT) {
                return {
                    formData,
                    status: StatusCode.CONFLICT,
                    message: "الموظف موجود فعلا"

                }
            }
        }
        console.log(error)
        return {
            formData,
            status: StatusCode.INTERNALSERVERERROR,
            message: "حدث حطا ما تواصل مع الدعم"
        }
    }
}