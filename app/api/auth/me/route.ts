import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export const runtime = "edge"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here")

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        username: payload.username,
        role: payload.role,
        name: payload.name,
      },
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
