"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function VisitorRegistrationPage() {
  const [formData, setFormData] = useState({
    visitorName: "",
    hostUnit: "",
    purpose: "",
    arrivalTime: "",
    expectedDuration: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<null | { success: boolean; message: string; visitorPass?: any }>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/visitors/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        success: false,
        message: "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Visitor Registration</h1>

        <Card>
          <CardHeader>
            <CardTitle>Register a Visitor</CardTitle>
            <CardDescription>
              Fill out this form to register a visitor to the building. They will receive a pass code for entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {response && (
              <Alert className={`mb-6 ${response.success ? "bg-green-50" : "bg-red-50"}`}>
                {response.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={response.success ? "text-green-600" : "text-red-600"}>
                  {response.message}
                </AlertDescription>
              </Alert>
            )}

            {response && response.success && response.visitorPass && (
              <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-800">Visitor Pass Generated</h3>
                <p className="mb-1 text-green-700">
                  <strong>Pass Code:</strong> {response.visitorPass.passCode}
                </p>
                <p className="mb-1 text-green-700">
                  <strong>Visitor:</strong> {response.visitorPass.visitorName}
                </p>
                <p className="mb-1 text-green-700">
                  <strong>Host Unit:</strong> {response.visitorPass.hostUnit}
                </p>
                <p className="mb-1 text-green-700">
                  <strong>Valid Until:</strong> {new Date(response.visitorPass.validUntil).toLocaleString()}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visitorName">Visitor Name</Label>
                <Input
                  id="visitorName"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostUnit">Host Unit</Label>
                <Input id="hostUnit" name="hostUnit" value={formData.hostUnit} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Expected Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="datetime-local"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDuration">Expected Duration (hours)</Label>
                <Input
                  id="expectedDuration"
                  name="expectedDuration"
                  type="number"
                  min="1"
                  value={formData.expectedDuration}
                  onChange={handleChange}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Registering..." : "Register Visitor"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
