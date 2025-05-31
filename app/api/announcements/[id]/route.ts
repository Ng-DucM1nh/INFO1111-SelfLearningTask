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

    // Only admin can update announcements
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can update announcements" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, category, important } = body
    const announcementId = Number.parseInt(params.id)

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    // Update the announcement in the database
    const updatedAnnouncement = await sql`
      UPDATE announcements 
      SET 
        title = ${title},
        content = ${content},
        category = ${category},
        important = ${important || false},
        updated_at = NOW()
      WHERE id = ${announcementId}
      RETURNING *
    `

    if (updatedAnnouncement.length === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement[0],
    })
  } catch (error) {
    console.error("Error updating announcement:", error)
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
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

    // Only admin can delete announcements
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Only administrators can delete announcements" }, { status: 403 })
    }

    const announcementId = Number.parseInt(params.id)

    // Delete the announcement from the database
    const deletedAnnouncement = await sql`
      DELETE FROM announcements 
      WHERE id = ${announcementId}
      RETURNING *
    `

    if (deletedAnnouncement.length === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}
