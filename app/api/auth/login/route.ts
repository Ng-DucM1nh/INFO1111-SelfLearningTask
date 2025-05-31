import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Hardcoded user accounts
const users = [
  {
    id: 1,
    username: "admin",
    password: "thegodlyadmin",
    role: "admin",
    name: "Admin User",
  },
  {
    id: 2,
    username: "resident",
    password: "powerlessresident",
    role: "resident",
    name: "Resident User",
  },
]

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = users.find((u) => u.username === username)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
    }

    // Create user data (exclude password)
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    }

    // Set cookie with user data
    cookies().set({
      name: "auth",
      value: JSON.stringify(userData),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during login" }, { status: 500 })
  }
}
