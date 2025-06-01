import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const PHP_HOST = process.env.PHP_SERVICE_URL || "https://your-php-app.railway.app"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${PHP_HOST}/login.php`, {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    })

    const html = await response.text()

    return new NextResponse(html, {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    return new NextResponse("PHP service unavailable", { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${PHP_HOST}/login.php`, {
      method: "POST",
      body: formData,
    })

    const html = await response.text()

    return new NextResponse(html, {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    return new NextResponse("PHP service unavailable", { status: 503 })
  }
}
