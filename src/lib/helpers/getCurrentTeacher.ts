import { getTeacherByUserId } from '@/features/teachers/api'
import nextAuthOptions from '@/server/auth'
import { getServerSession } from 'next-auth'

export async function getCurrentTeacher() {
  const session = await getServerSession(nextAuthOptions)
  const userId = session?.user?.id
  if (!userId) return null

  try {
    return await getTeacherByUserId(userId)
  } catch {
    return null
  }
}
