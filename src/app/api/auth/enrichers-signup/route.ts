import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const apiBaseUrl = process.env.BACKEND_URL
    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: "BACKEND_URL is not configured" },
        { status: 500 }
      )
    }

    const body = await request.json()

    const res = await fetch(`${apiBaseUrl}/auth/enrichers-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

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
