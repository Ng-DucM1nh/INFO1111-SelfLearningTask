import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "edge"

export async function POST() {
  // Clear the auth cookie
  cookies().delete("auth")

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })
}
