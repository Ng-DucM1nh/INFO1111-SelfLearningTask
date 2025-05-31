"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileText, Calendar, User, Trash2, Plus, X } from "lucide-react"

type MeetingMinute = {
  id: number
  meeting_date: string
  title: string
  description: string
  file_name: string
  file_type: string
  file_size: number
  uploaded_by: string
  uploaded_at: string
  updated_at: string
}

type AppUser = {
  id: number
  username: string
  role: string
  name: string
}

export default function MeetingMinutesPage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [minutes, setMinutes] = useState<MeetingMinute[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    meetingDate: "",
    title: "",
    description: "",
    file: null as File | null,
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

  // Fetch meeting minutes
  useEffect(() => {
    fetchMinutes()
  }, [])

  const fetchMinutes = async () => {
    try {
      const response = await fetch("/api/meeting-minutes")
      const data = await response.json()

      if (data.success) {
        setMinutes(data.data)
      } else {
        setMessage({ type: "error", text: "Failed to load meeting minutes" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load meeting minutes" })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file || !formData.meetingDate || !formData.title) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", formData.file)
      uploadFormData.append("meetingDate", formData.meetingDate)
      uploadFormData.append("title", formData.title)
      uploadFormData.append("description", formData.description)

      const response = await fetch("/api/meeting-minutes", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "File uploaded successfully!" })
        setFormData({ meetingDate: "", title: "", description: "", file: null })
        setShowUploadForm(false)
        fetchMinutes() // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Upload failed. Please try again." })
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const response = await fetch(`/api/meeting-minutes/${id}/download`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setMessage({ type: "error", text: "Failed to download file" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Download failed. Please try again." })
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/meeting-minutes/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "File deleted successfully!" })
        fetchMinutes() // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error || "Delete failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Delete failed. Please try again." })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("word")) return "📝"
    if (fileType.includes("text")) return "📃"
    return "📁"
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading meeting minutes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meeting Minutes Archive</h1>
            <p className="text-muted-foreground">Access committee meeting documents and minutes</p>
          </div>

          {user?.role === "admin" && (
            <Button onClick={() => setShowUploadForm(!showUploadForm)} className="mt-4 sm:mt-0">
              {showUploadForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && user?.role === "admin" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Meeting Document</CardTitle>
              <CardDescription>Upload meeting minutes, agendas, or other committee documents</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meetingDate">Meeting Date *</Label>
                    <Input
                      id="meetingDate"
                      type="date"
                      value={formData.meetingDate}
                      onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Document Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Monthly Committee Meeting Minutes"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the document contents"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="file">Document File *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Supported formats: PDF, Word documents, Text files (Max 10MB)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Meeting Minutes List */}
        <div className="space-y-4">
          {minutes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No meeting minutes available</h3>
                <p className="text-muted-foreground">
                  {user?.role === "admin"
                    ? "Upload the first document to get started."
                    : "Check back later for committee meeting documents."}
                </p>
              </CardContent>
            </Card>
          ) : (
            minutes.map((minute) => (
              <Card key={minute.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getFileIcon(minute.file_type)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{minute.title}</h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(minute.meeting_date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Uploaded by {minute.uploaded_by}
                            </div>
                            <Badge variant="secondary">{formatFileSize(minute.file_size)}</Badge>
                          </div>

                          {minute.description && (
                            <p className="text-sm text-muted-foreground mb-3">{minute.description}</p>
                          )}

                          <p className="text-xs text-muted-foreground">File: {minute.file_name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(minute.id, minute.file_name)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>

                      {user?.role === "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(minute.id, minute.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
