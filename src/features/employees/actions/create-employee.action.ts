"use server"

import { InitialState } from "@/lib/types/types";
import { addEmployee } from "../api"
import { CreateEmployee } from "../types/interfaces"
import { StatusCode } from "@/lib/types/enums";
import { ApiError } from "@/lib/errors/ApiError";




export async function createEmployeeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const payload = Object.fromEntries(formData.entries()) as unknown as CreateEmployee

    console.log("payload: ", payload)
    const res = await addEmployee(payload)
    console.log("ressssssssssssssssssssssss: ", await res)


    return { status: StatusCode.CREATED, message: "تم تسجيل الموظف بنجاح" }
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