import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Simple in-memory storage for demo (in production, use a real database)
const visitorRequests: any[] = []

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)

    // Only admin can update request status
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can update request status" }, { status: 403 })
    }

    const body = await request.json()
    const { status, committeeNotes } = body
    const requestId = params.id

    // Find and update the request
    const requestIndex = visitorRequests.findIndex((req) => req.id === requestId)

    if (requestIndex === -1) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    visitorRequests[requestIndex] = {
      ...visitorRequests[requestIndex],
      status,
      committeeNotes: committeeNotes || "",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Request status updated successfully",
      request: visitorRequests[requestIndex],
    })
  } catch (error) {
    console.error("Error updating visitor request:", error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
  }
}
