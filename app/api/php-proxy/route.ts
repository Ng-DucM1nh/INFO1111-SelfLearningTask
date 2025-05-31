import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()

    // The URL of your PHP API
    const phpApiUrl = "https://your-php-api-url.com/endpoint.php"

    // Forward the request to the PHP API
    const phpResponse = await fetch(phpApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Get the response from the PHP API
    const data = await phpResponse.json()

    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying to PHP API:", error)
    return NextResponse.json({ success: false, error: "Failed to connect to PHP service" }, { status: 500 })
  }
}
