"use server"

import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createChild } from "../api"
import { type Child } from "../types/interfaces"
import { ApiError } from "@/lib/errors/ApiError"

export async function createChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const payload = Object.fromEntries(formData.entries()) as unknown as Partial<Child>
    await createChild(payload)



    return { status: StatusCode.CREATED, message: "تم إضافة الطفل بنجاح" }
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

