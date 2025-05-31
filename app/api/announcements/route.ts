import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get all announcements ordered by creation date (newest first)
    const announcements = await sql`
      SELECT 
        id,
        title,
        content,
        category,
        important,
        created_at,
        updated_at
      FROM announcements 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ success: true, data: announcements })
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get auth cookie
    const authCookie = cookies().get("auth")

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "You must be logged in to create announcements" }, { status: 401 })
    }

    const userData = JSON.parse(authCookie.value)

    // Only admin can create announcements
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can create announcements" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, category, important } = body

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    // Insert new announcement into database
    const newAnnouncement = await sql`
      INSERT INTO announcements (
        title, 
        content, 
        category, 
        important
      ) VALUES (
        ${title},
        ${content},
        ${category},
        ${important || false}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement[0],
    })
  } catch (error) {
    console.error("Error creating announcement:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}
