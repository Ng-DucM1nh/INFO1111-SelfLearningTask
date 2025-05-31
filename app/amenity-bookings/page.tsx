"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Shield, AlertCircle, User } from "lucide-react"

type Booking = {
  id: number
  resident_username: string
  resident_name: string
  amenity: string
  booking_date: string
  booking_time: string
  duration: number
  status: "pending" | "accepted" | "rejected"
  admin_notes: string
  created_at: string
}

const amenities = ["BBQ Area", "Function Room", "Tennis Court", "Swimming Pool", "Gym", "Rooftop Garden"]

export default function AmenityBookingsPage() {
  const [user, setUser] = useState<any | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  // Form state
  const [formData, setFormData] = useState({
    amenity: "",
    booking_date: "",
    booking_time: "",
    duration: "",
  })

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

  // Fetch bookings when user is available
  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/amenity-bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        console.error("Failed to fetch bookings")
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is logged in
    if (!user) {
      setMessage("You must be logged in to submit a booking request")
      setMessageType("error")
      return
    }

    // Validate form
    if (!formData.amenity || !formData.booking_date || !formData.booking_time || !formData.duration) {
      setMessage("Please fill in all fields")
      setMessageType("error")
      return
    }

    // Check if date is in the past
    const selectedDate = new Date(formData.booking_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setMessage("Cannot book amenities for past dates")
      setMessageType("error")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/amenity-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Booking request submitted successfully!")
        setMessageType("success")
        setFormData({
          amenity: "",
          booking_date: "",
          booking_time: "",
          duration: "",
        })
        fetchBookings()
      } else {
        setMessage(data.error || "Failed to submit booking request")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("An error occurred while submitting the request")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, status: string, adminNotes = "") => {
    try {
      const response = await fetch(`/api/amenity-bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      })

      if (response.ok) {
        setMessage(`Booking ${status} successfully`)
        setMessageType("success")
        fetchBookings()
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to update booking status")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("An error occurred while updating the booking")
      setMessageType("error")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // Remove seconds
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Amenity Bookings</h1>
          <p className="text-gray-600">Book building amenities and manage your reservations</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              messageType === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {message}
            </div>
          </div>
        )}

        <div className={`grid gap-8 ${user?.role === "admin" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
          {/* Booking Form - Only show for non-admin users */}
          {user?.role !== "admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Amenity
                </CardTitle>
                {!user && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    You can explore the booking options below, but you must be logged in to submit a request.
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amenity">Amenity</Label>
                    <Select
                      value={formData.amenity}
                      onValueChange={(value) => setFormData({ ...formData, amenity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an amenity" />
                      </SelectTrigger>
                      <SelectContent>
                        {amenities.map((amenity) => (
                          <SelectItem key={amenity} value={amenity}>
                            {amenity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="booking_date">Date</Label>
                    <Input
                      id="booking_date"
                      type="date"
                      min={getMinDate()}
                      value={formData.booking_date}
                      onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="booking_time">Time</Label>
                    <Input
                      id="booking_time"
                      type="time"
                      value={formData.booking_time}
                      onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour} hour{hour > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Booking Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Bookings List */}
          {user && (
            <Card className={user.role === "admin" ? "max-w-4xl mx-auto" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {user.role === "admin" ? (
                    <>
                      <Shield className="mr-2 h-5 w-5 text-blue-600" />
                      All Resident Bookings (Past 7 Days)
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-5 w-5 text-green-600" />
                      My Bookings (Past 7 Days)
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {user.role === "admin"
                      ? "No booking requests found from the past 7 days"
                      : "You haven't made any booking requests in the past 7 days"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{booking.amenity}</span>
                              {getStatusBadge(booking.status)}
                            </div>
                            {user.role === "admin" && (
                              <p className="text-sm text-gray-600 mt-1">
                                Resident: {booking.resident_name} ({booking.resident_username})
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(booking.booking_date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(booking.booking_time)} ({booking.duration}h)
                          </div>
                        </div>

                        {booking.admin_notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Admin Notes:</strong> {booking.admin_notes}
                          </div>
                        )}

                        <div className="text-xs text-gray-500">Submitted: {formatDate(booking.created_at)}</div>

                        {user.role === "admin" && (
                          <div className="flex space-x-2 pt-2 border-t">
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, "accepted")}
                              className={`${
                                booking.status === "accepted"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                              disabled={booking.status === "accepted"}
                            >
                              {booking.status === "accepted" ? "✓ Accepted" : "Accept"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, "rejected")}
                              className={`${
                                booking.status === "rejected"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                              disabled={booking.status === "rejected"}
                            >
                              {booking.status === "rejected" ? "✗ Rejected" : "Reject"}
                            </Button>
                            {booking.status !== "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, "pending")}
                              >
                                Reset to Pending
                              </Button>
                            )}
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
