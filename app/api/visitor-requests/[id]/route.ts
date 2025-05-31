import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
    const requestId = Number.parseInt(params.id)

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update the request in the database
    const updatedRequest = await sql`
      UPDATE visitor_requests 
      SET 
        status = ${status},
        committee_notes = ${committeeNotes || ""},
        updated_at = NOW()
      WHERE id = ${requestId}
      RETURNING *
    `

    if (updatedRequest.length === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Request status updated successfully",
      request: updatedRequest[0],
    })
  } catch (error) {
    console.error("Error updating visitor request:", error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)
    const requestId = Number.parseInt(params.id)

    // Admin can delete any request, residents can only delete their own pending requests
    let deletedRequest
    if (userData.role === "admin") {
      deletedRequest = await sql`
        DELETE FROM visitor_requests 
        WHERE id = ${requestId}
        RETURNING *
      `
    } else {
      deletedRequest = await sql`
        DELETE FROM visitor_requests 
        WHERE id = ${requestId} 
        AND resident_username = ${userData.username}
        AND status = 'pending'
        RETURNING *
      `
    }

    if (deletedRequest.length === 0) {
      return NextResponse.json({ error: "Request not found or cannot be deleted" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Request deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting visitor request:", error)
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 })
  }
}
