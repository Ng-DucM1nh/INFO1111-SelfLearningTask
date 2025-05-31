import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get file data from database
    const result = await sql`
      SELECT file_data, file_name, file_type
      FROM meeting_minutes 
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 })
    }

    const { file_data, file_name, file_type } = result[0]

    // Convert base64 back to buffer
    const buffer = Buffer.from(file_data, "base64")

    // Return file with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file_type,
        "Content-Disposition": `attachment; filename="${file_name}"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ success: false, error: "Failed to download file" }, { status: 500 })
  }
}
