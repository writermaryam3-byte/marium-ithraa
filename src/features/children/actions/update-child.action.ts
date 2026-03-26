"use server"

import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { updateChild } from "../api"
import { type Child } from "../types/interfaces"
import { ApiError } from "@/lib/errors/ApiError"

export async function updateChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { status: StatusCode.BADREQUEST, message: "معرّف الطفل غير صالح", formData }
    }

    const payload = Object.fromEntries(formData.entries().drop(1)) as unknown as Partial<Child>
    await updateChild(id, payload)


    return { status: StatusCode.OK, message: "تم تحديث بيانات الطفل بنجاح" }
  } catch(error) {
    if( error instanceof ApiError){
      if(error.status===StatusCode.BADREQUEST){
        return{
          formData,
          error: error.validationErrors,
          status: StatusCode.BADREQUEST,
        }
      }
      if(error.status===StatusCode.CONFLICT){
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

