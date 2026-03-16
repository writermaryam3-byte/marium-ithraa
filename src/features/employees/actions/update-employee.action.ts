"use server"

import { StatusCode } from "@/lib/types/enums"
import { updateEmployee } from "../api"
import { UpdateEmployee } from "../types/interfaces"
import { InitialState } from "@/lib/types/types"


export async function updateEmployeeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { status: StatusCode.BADREQUEST, message: "معرّف الموظف غير صالح", formData}
    }
    const payload = Object.fromEntries(formData.entries().drop(1)) as unknown as UpdateEmployee

    console.log("payload: ", payload)
    const res = await updateEmployee(id, payload)
    console.log("res: ",  ( res))

    if (!res.ok) {
      if(res.status===StatusCode.BADREQUEST){
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

    return { status: StatusCode.OK, message: "تم تحديث الموظف بنجاح" }
  } catch {
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث حطا ما تواصل مع الدعم"
    }
  }
}

