import { NextResponse } from "next/server"

export const runtime = "edge"

// This function would check for any active emergency notifications
// for the building (fire alarms, evacuations, etc.)
export async function GET() {
  // In a real app, this would check a database or service
  // For demo purposes, we'll return mock data

  // No active emergencies
  const emergencyData = {
    hasActiveEmergency: false,
    emergencies: [],
    lastChecked: new Date().toISOString(),
  }

  // Uncomment to simulate an active emergency
  /*
  const emergencyData = {
    hasActiveEmergency: true,
    emergencies: [
      {
        id: "em-1",
        type: "fire_alarm",
        message: "Fire alarm activated on floor 3. Please evacuate the building using the stairs.",
        startTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        severity: "high",
      }
    ],
    lastChecked: new Date().toISOString(),
  }
  */

  return NextResponse.json(emergencyData)
}
