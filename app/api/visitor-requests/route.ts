import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Simple in-memory storage for demo (in production, use a real database)
let visitorRequests: any[] = []

export async function GET() {
  try {
    // Clean up expired requests (older than 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    visitorRequests = visitorRequests.filter((request) => new Date(request.createdAt) > sevenDaysAgo)

    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)

    // Filter requests based on user role
    let filteredRequests = visitorRequests
    if (userData.role === "resident") {
      filteredRequests = visitorRequests.filter((request) => request.residentUsername === userData.username)
    }

    return NextResponse.json({
      requests: filteredRequests,
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

    // Create new request
    const newRequest = {
      id: Date.now().toString(),
      residentUsername: userData.username,
      residentName: userData.name,
      visitorName,
      visitorPhone,
      visitDate,
      visitTime,
      purpose,
      status: "pending",
      committeeNotes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    visitorRequests.push(newRequest)

    return NextResponse.json({
      success: true,
      message: "Visitor request submitted successfully",
      request: newRequest,
    })
  } catch (error) {
    console.error("Error creating visitor request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
