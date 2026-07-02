import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) {
    return NextResponse.json({ message: 'Backend URL is not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'Missing refresh token' }, { status: 401 })
  }

  try {
    const res = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Failed to refresh token' }, { status: 500 })
  }
}
