import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "edge"

export async function GET() {
  try {
    // Get the auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Parse the user data from the cookie
    const userData = JSON.parse(authCookie.value)

    return NextResponse.json({
      authenticated: true,
      user: userData,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false, error: "Failed to verify authentication" }, { status: 500 })
  }
}
