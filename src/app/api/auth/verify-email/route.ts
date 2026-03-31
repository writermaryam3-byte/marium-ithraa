import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiBaseUrl = process.env.BACKEND_URL
    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: "BACKEND_URL is not configured" },
        { status: 500 }
      )
    }

    const token = request.nextUrl.searchParams.get("token")
    if (!token) {
      return NextResponse.json(
        { message: "Missing token" },
        { status: 400 }
      )
    }

    const res = await fetch(
      `${apiBaseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
      {
        cache: "no-store",
      }
    )

    const contentType = res.headers.get("content-type") ?? ""
    const payload = contentType.includes("application/json")
      ? await res.json()
      : await res.text()

    return NextResponse.json(payload, { status: res.status })
  } catch {
    return NextResponse.json(
      { message: "Unexpected server error" },
      { status: 500 }
    )
  }
}

