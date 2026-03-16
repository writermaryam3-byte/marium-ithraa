"use server"

import { InitialState } from "@/lib/types/types";
import { addEmployee } from "../api"
import { CreateEmployee } from "../types/interfaces"
import { StatusCode } from "@/lib/types/enums";




export async function createEmployeeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const payload = Object.fromEntries(formData.entries()) as unknown as CreateEmployee

    console.log("payload: ", payload)
    const res = await addEmployee(payload)
    console.log("res: ", await (res))

    if (!res.ok) {
      if(res.status===StatusCode.BADREQUEST){
        console.log("hi")
        return{
          formData,
          error: await res.json(),
          status: StatusCode.BADREQUEST,
        }
      }
      if(res.status===StatusCode.CONFLICT){
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

    return { status: StatusCode.CREATED, message: "تم تسجيل الموظف بنجاح" }
  } catch {
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث حطا ما تواصل مع الدعم"
    }
  }
}