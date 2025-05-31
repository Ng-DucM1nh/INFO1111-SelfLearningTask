"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Shield, User, Calendar } from "lucide-react"

type VisitorRequest = {
  id: string
  residentUsername: string
  residentName: string
  visitorName: string
  visitorPhone: string
  visitDate: string
  visitTime: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  committeeNotes: string
  createdAt: string
  updatedAt: string
}

type AuthUser = {
  id: number
  username: string
  role: string
  name: string
}

export default function VisitorsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [requests, setRequests] = useState<VisitorRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorPhone: "",
    visitDate: "",
    visitTime: "",
    purpose: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fetch visitor requests
  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    setRequestsLoading(true)
    try {
      const response = await fetch("/api/visitor-requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setRequestsLoading(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setMessage({ type: "error", text: "You must be logged in to submit a visitor request" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/visitor-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message })
        setFormData({
          visitorName: "",
          visitorPhone: "",
          visitDate: "",
          visitTime: "",
          purpose: "",
        })
        fetchRequests() // Refresh the requests list
      } else {
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string, notes = "") => {
    try {
      const response = await fetch(`/api/visitor-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, committeeNotes: notes }),
      })

      if (response.ok) {
        fetchRequests() // Refresh the requests list
        setMessage({ type: "success", text: "Request status updated successfully" })
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update request status" })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString()
  }

  if (authLoading) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold">Visitor Management</h1>
          {user ? (
            <div className="flex items-center justify-center gap-2 text-lg">
              {user.role === "admin" ? (
                <Shield className="h-5 w-5 text-blue-600" />
              ) : (
                <User className="h-5 w-5 text-green-600" />
              )}
              <span>
                Welcome, {user.name} ({user.role})
              </span>
            </div>
          ) : (
            <p className="text-gray-600">Please log in to submit visitor requests</p>
          )}
        </div>

        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-600" : "text-red-600"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Visitor Request Form - Show for residents and non-logged users */}
          {(!user || user.role === "resident") && (
            <Card>
              <CardHeader>
                <CardTitle>Submit Visitor Request</CardTitle>
                <CardDescription>
                  Fill out this form to register a visitor to the building.
                  {!user && " You must be logged in to submit the request."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitorName">Visitor Name *</Label>
                    <Input
                      id="visitorName"
                      name="visitorName"
                      value={formData.visitorName}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitorPhone">Visitor Phone Number *</Label>
                    <Input
                      id="visitorPhone"
                      name="visitorPhone"
                      type="tel"
                      value={formData.visitorPhone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Visit Date *</Label>
                    <Input
                      id="visitDate"
                      name="visitDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.visitDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitTime">Visit Time *</Label>
                    <Input
                      id="visitTime"
                      name="visitTime"
                      type="time"
                      value={formData.visitTime}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Visit *</Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleFormChange}
                      placeholder="Please describe the purpose of the visit..."
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Requests List */}
          {user && (
            <Card className={!user || user.role === "resident" ? "" : "lg:col-span-2"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {user.role === "admin" ? "All Visitor Requests" : "My Visitor Requests"}
                  <span className="text-sm font-normal text-gray-500">(Past 7 Days)</span>
                </CardTitle>
                <CardDescription>
                  {user.role === "admin"
                    ? "Manage visitor requests from all residents. Requests are automatically deleted after 7 days."
                    : "View and track your submitted visitor requests from the past 7 days."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <p className="text-center py-8">Loading requests...</p>
                ) : requests.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No visitor requests found from the past 7 days.</p>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{request.visitorName}</h3>
                            {user.role === "admin" && (
                              <p className="text-sm text-gray-600">
                                Requested by: {request.residentName} ({request.residentUsername})
                              </p>
                            )}
                            <p className="text-sm text-gray-600">Phone: {request.visitorPhone}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <strong>Visit Date:</strong> {new Date(request.visitDate).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Visit Time:</strong> {request.visitTime}
                          </div>
                        </div>

                        <div className="mb-3">
                          <strong className="text-sm">Purpose:</strong>
                          <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
                        </div>

                        {request.committeeNotes && (
                          <div className="mb-3">
                            <strong className="text-sm">Committee Notes:</strong>
                            <p className="text-sm text-gray-600 mt-1">{request.committeeNotes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Submitted: {new Date(request.createdAt).toLocaleString()}</span>
                          {request.updatedAt !== request.createdAt && (
                            <span>Updated: {new Date(request.updatedAt).toLocaleString()}</span>
                          )}
                        </div>

                        {/* Admin controls */}
                        {user.role === "admin" && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={request.status === "approved" ? "default" : "outline"}
                                onClick={() => handleStatusUpdate(request.id, "approved")}
                                className="text-xs"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant={request.status === "rejected" ? "destructive" : "outline"}
                                onClick={() => handleStatusUpdate(request.id, "rejected")}
                                className="text-xs"
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant={request.status === "pending" ? "secondary" : "outline"}
                                onClick={() => handleStatusUpdate(request.id, "pending")}
                                className="text-xs"
                              >
                                Set Pending
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
