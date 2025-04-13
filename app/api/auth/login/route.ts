import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { username, password } = body

    // In a real application, you would validate credentials here
    // For now, we'll just return a dummy response

    // Simulate a slight delay to make the loading state visible
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "This is a dummy login. No actual authentication occurred.",
    })
  } catch (error) {
    // Return an error response
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
