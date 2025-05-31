"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Plus, Edit, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react"

type Announcement = {
  id: number
  title: string
  content: string
  category: string
  important: boolean
  created_at: string
  updated_at: string
}

type AppUser = {
  id: number
  username: string
  role: string
  name: string
}

export default function NewsPage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    important: false,
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

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      const data = await response.json()

      if (data.success) {
        setAnnouncements(data.data)
      } else {
        setMessage({ type: "error", text: "Failed to load announcements" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load announcements" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const url = editingId ? `/api/announcements/${editingId}` : "/api/announcements"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingId ? "Announcement updated successfully!" : "Announcement created successfully!",
        })
        setFormData({ title: "", content: "", category: "", important: false })
        setShowForm(false)
        setEditingId(null)
        fetchAnnouncements() // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error || "Operation failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Operation failed. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      important: announcement.important,
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Announcement deleted successfully!" })
        fetchAnnouncements() // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error || "Delete failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Delete failed. Please try again." })
    }
  }

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "", important: false })
    setEditingId(null)
    setShowForm(false)
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (authLoading || loading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">News & Announcements</h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Stay updated with the latest information about J02 Building
            </p>
          </div>

          {user?.role === "admin" && (
            <Button onClick={() => setShowForm(!showForm)} className="sm:ml-4">
              {showForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Announcement
                </>
              )}
            </Button>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <Alert
            className={`${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Add/Edit Form */}
        {showForm && user?.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter announcement content"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="important"
                      checked={formData.important}
                      onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="important">Mark as Important</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{editingId ? "Update Announcement" : "Create Announcement"}</>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No announcements available</h3>
                <p className="text-gray-500">
                  {user?.role === "admin"
                    ? "Create the first announcement to get started."
                    : "Check back later for updates."}
                </p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className={announcement.important ? "border-2 border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{announcement.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {announcement.important && <Badge variant="destructive">Important</Badge>}
                      {user?.role === "admin" && (
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(announcement.id, announcement.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">{announcement.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{formatDate(announcement.created_at)}</span>
                  </div>
                  <Badge variant="outline">{announcement.category}</Badge>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
