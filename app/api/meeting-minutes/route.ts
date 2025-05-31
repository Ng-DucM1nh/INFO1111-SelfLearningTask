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

export async function GET() {
  try {
    // Get all meeting minutes ordered by meeting date (newest first)
    const minutes = await sql`
      SELECT 
        id,
        meeting_date,
        title,
        description,
        file_name,
        file_type,
        file_size,
        uploaded_by,
        uploaded_at,
        updated_at
      FROM meeting_minutes 
      ORDER BY meeting_date DESC, uploaded_at DESC
    `

    return NextResponse.json({ success: true, data: minutes })
  } catch (error) {
    console.error("Error fetching meeting minutes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch meeting minutes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)

    // Only admin can upload files
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Only admins can upload files." },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const meetingDate = formData.get("meetingDate") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file || !meetingDate || !title) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Check file type (allow common document types)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Only PDF, Word, and text files are allowed" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString("base64")

    // Insert into database
    const result = await sql`
      INSERT INTO meeting_minutes (
        meeting_date,
        title,
        description,
        file_name,
        file_data,
        file_type,
        file_size,
        uploaded_by
      ) VALUES (
        ${meetingDate},
        ${title},
        ${description || ""},
        ${file.name},
        ${base64Data},
        ${file.type},
        ${file.size},
        ${user.username}
      )
      RETURNING id, meeting_date, title, file_name, uploaded_at
    `

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 })
  }
}
