"use server"

import { deleteChild } from "../api"

export type DeleteChildState = {
  ok: boolean
  error?: string
}

export async function deleteChildAction(
  _prevState: DeleteChildState,
  formData: FormData,
): Promise<DeleteChildState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { ok: false, error: "معرّف الطفل غير صالح" }
    }

    await deleteChild(id)


    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف الطفل" }
  }
}

