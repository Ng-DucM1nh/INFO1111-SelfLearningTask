"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type Emergency = {
  id: string
  type: string
  message: string
  startTime: string
  severity: string
}

type EmergencyData = {
  hasActiveEmergency: boolean
  emergencies: Emergency[]
  lastChecked: string
}

export default function EmergencyAlert() {
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null)
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const checkEmergencies = async () => {
      try {
        const response = await fetch("/api/emergency")
        const data = await response.json()
        setEmergencyData(data)
      } catch (error) {
        console.error("Failed to check for emergencies:", error)
      }
    }

    // Check immediately on load
    checkEmergencies()

    // Then check every 5 minutes
    const interval = setInterval(checkEmergencies, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const dismissAlert = (id: string) => {
    setDismissed((prev) => ({ ...prev, [id]: true }))
  }

  if (!emergencyData || !emergencyData.hasActiveEmergency) {
    return null
  }

  return (
    <div className="space-y-4 p-4">
      {emergencyData.emergencies
        .filter((emergency) => !dismissed[emergency.id])
        .map((emergency) => (
          <Alert key={emergency.id} variant="destructive" className="relative">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">EMERGENCY ALERT</AlertTitle>
            <AlertDescription>{emergency.message}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => dismissAlert(emergency.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </Alert>
        ))}
    </div>
  )
}
