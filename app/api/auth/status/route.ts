import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  // In a real application, you might check database or other services
  // to determine if the login system is available

  // For now, we'll always return that logins are accepted
  return NextResponse.json({
    acceptingLogins: true,
    message: "Login system is operational.",
    // You could add other useful information here, such as:
    // - Maintenance windows
    // - Login requirements
    // - Available authentication methods
  })
}
