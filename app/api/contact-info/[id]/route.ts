import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Connect to the database
const sql = neon(process.env.DATABASE_URL!)

// Helper function to get user from token
const getUserFromToken = (request: NextRequest) => {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-here") as any
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      name: decoded.name,
    }
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}

// PUT - Update contact info
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromToken(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number.parseInt(params.id)

  try {
    // Check if the contact info exists
    const existingContact = await sql`
      SELECT * FROM contact_info WHERE id = ${id}
    `

    if (existingContact.length === 0) {
      return NextResponse.json({ error: "Contact info not found" }, { status: 404 })
    }

    // Check if user is authorized (admin or the owner of the contact info)
    if (user.role !== "admin" && user.username !== existingContact[0].username) {
      return NextResponse.json({ error: "You can only update your own contact info" }, { status: 403 })
    }

    const { unit, owner_name, phone_number, email } = await request.json()

    // Validate required fields
    if (!unit || !owner_name || !phone_number || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Update contact info
    const result = await sql`
      UPDATE contact_info
      SET unit = ${unit}, owner_name = ${owner_name}, phone_number = ${phone_number}, email = ${email}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ contactInfo: result[0] })
  } catch (error) {
    console.error("Error updating contact info:", error)
    return NextResponse.json({ error: "Failed to update contact info" }, { status: 500 })
  }
}

// DELETE - Delete contact info (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromToken(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete contact info" }, { status: 403 })
  }

  const id = Number.parseInt(params.id)

  try {
    // Check if the contact info exists
    const existingContact = await sql`
      SELECT * FROM contact_info WHERE id = ${id}
    `

    if (existingContact.length === 0) {
      return NextResponse.json({ error: "Contact info not found" }, { status: 404 })
    }

    // Delete contact info
    await sql`
      DELETE FROM contact_info
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact info:", error)
    return NextResponse.json({ error: "Failed to delete contact info" }, { status: 500 })
  }
}
