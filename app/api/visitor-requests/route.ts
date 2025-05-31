import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Clean up expired requests (older than 7 days)
    await sql`
      DELETE FROM visitor_requests 
      WHERE created_at < NOW() - INTERVAL '7 days'
    `

    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)

    // Fetch requests based on user role
    let requests
    if (userData.role === "admin") {
      // Admin sees all requests from the past 7 days
      requests = await sql`
        SELECT * FROM visitor_requests 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
      `
    } else {
      // Residents see only their own requests from the past 7 days
      requests = await sql`
        SELECT * FROM visitor_requests 
        WHERE resident_username = ${userData.username}
        AND created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({
      requests: requests,
      userRole: userData.role,
      username: userData.username,
    })
  } catch (error) {
    console.error("Error fetching visitor requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "You must be logged in to submit a visitor request" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)
    const body = await request.json()

    const { visitorName, visitorPhone, visitDate, visitTime, purpose } = body

    // Validation
    if (!visitorName || !visitorPhone || !visitDate || !visitTime || !purpose) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if visit date is not in the past
    const visitDateTime = new Date(`${visitDate}T${visitTime}`)
    if (visitDateTime < new Date()) {
      return NextResponse.json({ error: "Visit date and time cannot be in the past" }, { status: 400 })
    }

    // Insert new request into database
    const newRequest = await sql`
      INSERT INTO visitor_requests (
        resident_username, 
        resident_name, 
        visitor_name, 
        visitor_phone, 
        visit_date, 
        visit_time, 
        purpose,
        status,
        committee_notes
      ) VALUES (
        ${userData.username},
        ${userData.name || userData.username},
        ${visitorName},
        ${visitorPhone},
        ${visitDate},
        ${visitTime},
        ${purpose},
        'pending',
        ''
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Visitor request submitted successfully",
      request: newRequest[0],
    })
  } catch (error) {
    console.error("Error creating visitor request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
