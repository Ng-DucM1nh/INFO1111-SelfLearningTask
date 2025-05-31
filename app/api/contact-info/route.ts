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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-here")
    return decoded as { id: number; username: string; role: string; name: string }
  } catch (error) {
    return null
  }
}

// GET - Fetch contact info (admin gets all, resident gets their own)
export async function GET(request: NextRequest) {
  const user = getUserFromToken(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    let contactInfo

    if (user.role === "admin") {
      // Admin gets all contact info
      contactInfo = await sql`
        SELECT * FROM contact_info
        ORDER BY unit ASC
      `
    } else {
      // Resident gets only their own contact info
      contactInfo = await sql`
        SELECT * FROM contact_info
        WHERE username = ${user.username}
      `
    }

    return NextResponse.json({ contactInfo })
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 })
  }
}

// POST - Create new contact info (admin only)
export async function POST(request: NextRequest) {
  const user = getUserFromToken(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Only admins can create new contact info" }, { status: 403 })
  }

  try {
    const { username, unit, owner_name, phone_number, email } = await request.json()

    // Validate required fields
    if (!username || !unit || !owner_name || !phone_number || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await sql`
      SELECT id FROM contact_info WHERE username = ${username}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Create new contact info
    const result = await sql`
      INSERT INTO contact_info (username, unit, owner_name, phone_number, email)
      VALUES (${username}, ${unit}, ${owner_name}, ${phone_number}, ${email})
      RETURNING *
    `

    return NextResponse.json({ contactInfo: result[0] })
  } catch (error) {
    console.error("Error creating contact info:", error)
    return NextResponse.json({ error: "Failed to create contact info" }, { status: 500 })
  }
}
