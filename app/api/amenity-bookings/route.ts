import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Clean up expired bookings (older than 7 days)
    await sql`
      DELETE FROM amenity_bookings 
      WHERE created_at < NOW() - INTERVAL '7 days'
    `

    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)

    // Fetch bookings based on user role
    let bookings
    if (userData.role === "admin") {
      // Admin sees all bookings from the past 7 days
      bookings = await sql`
        SELECT * FROM amenity_bookings 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
      `
    } else {
      // Residents see only their own bookings from the past 7 days
      bookings = await sql`
        SELECT * FROM amenity_bookings 
        WHERE resident_username = ${userData.username}
        AND created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({
      bookings: bookings,
      userRole: userData.role,
      username: userData.username,
    })
  } catch (error) {
    console.error("Error fetching amenity bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "You must be logged in to submit a booking request" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)

    // Only residents can create bookings
    if (userData.role !== "resident") {
      return NextResponse.json({ error: "Only residents can create booking requests" }, { status: 403 })
    }

    const body = await request.json()
    const { amenity, booking_date, booking_time, duration } = body

    // Validation
    if (!amenity || !booking_date || !booking_time || !duration) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if booking date is not in the past
    const bookingDateTime = new Date(`${booking_date}T${booking_time}`)
    if (bookingDateTime < new Date()) {
      return NextResponse.json({ error: "Booking date and time cannot be in the past" }, { status: 400 })
    }

    // Check for conflicting bookings (same amenity, overlapping time)
    const endTime = new Date(bookingDateTime.getTime() + Number.parseInt(duration) * 60 * 60 * 1000)
    const conflictingBookings = await sql`
      SELECT * FROM amenity_bookings 
      WHERE amenity = ${amenity}
      AND booking_date = ${booking_date}
      AND status = 'accepted'
      AND (
        (booking_time <= ${booking_time} AND 
         (booking_time::time + (duration || ' hours')::interval)::time > ${booking_time}) OR
        (booking_time < ${endTime.toTimeString().slice(0, 8)} AND 
         booking_time >= ${booking_time})
      )
    `

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        {
          error: "This amenity is already booked for the selected time slot",
        },
        { status: 400 },
      )
    }

    // Insert new booking into database
    const newBooking = await sql`
      INSERT INTO amenity_bookings (
        resident_username, 
        resident_name, 
        amenity, 
        booking_date, 
        booking_time, 
        duration,
        status,
        admin_notes
      ) VALUES (
        ${userData.username},
        ${userData.name || userData.username},
        ${amenity},
        ${booking_date},
        ${booking_time},
        ${Number.parseInt(duration)},
        'pending',
        ''
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Booking request submitted successfully",
      booking: newBooking[0],
    })
  } catch (error) {
    console.error("Error creating amenity booking:", error)
    return NextResponse.json({ error: "Failed to create booking request" }, { status: 500 })
  }
}
