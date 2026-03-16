"use server"

import { deleteEmployee } from "../api"

export type DeleteEmployeeState = {
  ok: boolean
  error?: string
}

export async function deleteEmployeeAction(
  _prevState: DeleteEmployeeState,
  formData: FormData,
): Promise<DeleteEmployeeState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { ok: false, error: "معرّف الموظف غير صالح" }
    }

    const res = await deleteEmployee(id)
    console.log(await res.json())
    if (!res.ok) {
      return {
        ok: false,
        error: "حدث خطأ أثناء حذف الموظف",
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      error: "حدث خطأ غير متوقع أثناء حذف الموظف",
    }
  }
}

