import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

// Helper function to get user from token
function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-here") as any
    return decoded
  } catch {
    return null
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(request)

    // Only admin can delete files
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Only admins can delete files." },
        { status: 401 },
      )
    }

    const id = params.id

    // Delete from database
    const result = await sql`
      DELETE FROM meeting_minutes 
      WHERE id = ${id}
      RETURNING id, title, file_name
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 })
  }
}
