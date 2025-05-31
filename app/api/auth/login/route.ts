import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export const runtime = "edge"

// Hardcoded user accounts
const users = [
  {
    id: 1,
    username: "admin",
    password: "thegodlyadmin",
    role: "admin",
    name: "Administrator",
  },
  {
    id: 2,
    username: "resident",
    password: "powerlessresident",
    role: "resident",
    name: "Resident User",
  },
]

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Find user with matching credentials
    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token expires in 7 days
      .sign(JWT_SECRET)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    })

    // Set HTTP-only cookie with the token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
