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

    // Only admin can update booking status
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can update booking status" }, { status: 403 })
    }

    const body = await request.json()
    const { status, admin_notes } = body
    const bookingId = Number.parseInt(params.id)

    // Validate status
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update the booking in the database
    const updatedBooking = await sql`
      UPDATE amenity_bookings 
      SET 
        status = ${status},
        admin_notes = ${admin_notes || ""},
        updated_at = NOW()
      WHERE id = ${bookingId}
      RETURNING *
    `

    if (updatedBooking.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking[0],
    })
  } catch (error) {
    console.error("Error updating amenity booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
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
    const bookingId = Number.parseInt(params.id)

    // Admin can delete any booking, residents can only delete their own pending bookings
    let deletedBooking
    if (userData.role === "admin") {
      deletedBooking = await sql`
        DELETE FROM amenity_bookings 
        WHERE id = ${bookingId}
        RETURNING *
      `
    } else {
      deletedBooking = await sql`
        DELETE FROM amenity_bookings 
        WHERE id = ${bookingId} 
        AND resident_username = ${userData.username}
        AND status = 'pending'
        RETURNING *
      `
    }

    if (deletedBooking.length === 0) {
      return NextResponse.json({ error: "Booking not found or cannot be deleted" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting amenity booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
