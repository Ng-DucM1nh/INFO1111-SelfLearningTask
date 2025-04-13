import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { visitorName, hostUnit, purpose, arrivalTime, expectedDuration } = body

    // Validate required fields
    if (!visitorName || !hostUnit || !purpose) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to a database
    // For demo purposes, we'll just return success

    // Generate a visitor pass code
    const passCode = Math.floor(100000 + Math.random() * 900000).toString()

    return NextResponse.json({
      success: true,
      message: "Visitor registered successfully",
      visitorPass: {
        passCode,
        visitorName,
        hostUnit,
        registeredAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Valid for 24 hours
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
