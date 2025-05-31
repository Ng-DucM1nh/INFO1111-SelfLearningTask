"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Plus, Save, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ContactInfo = {
  id: number
  username: string
  unit: string
  owner_name: string
  phone_number: string
  email: string
  created_at: string
  updated_at: string
}

type User = {
  id: number
  username: string
  role: string
  name: string
}

export default function ContactInfoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    unit: "",
    owner_name: "",
    phone_number: "",
    email: "",
  })

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentContactId, setCurrentContactId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check authentication and fetch contact info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            setUser(data.user)
            fetchContactInfo()
          } else {
            // Redirect to login if not authenticated
            router.push("/login")
          }
        } else {
          // Redirect to login if not authenticated
          router.push("/login")
        }
      } catch (error) {
        setError("Authentication error. Please try again.")
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // Fetch contact info
  const fetchContactInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/contact-info")
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data.contactInfo)
      } else {
        setError("Failed to fetch contact information")
      }
    } catch (error) {
      setError("An error occurred while fetching contact information")
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Open edit dialog and populate form
  const handleEditClick = (contact: ContactInfo) => {
    setFormData({
      unit: contact.unit,
      owner_name: contact.owner_name,
      phone_number: contact.phone_number,
      email: contact.email,
    })
    setCurrentContactId(contact.id)
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const handleDeleteClick = (id: number) => {
    setCurrentContactId(id)
    setIsDeleteDialogOpen(true)
  }

  // Submit form to update contact info
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/contact-info/${currentContactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Contact information updated successfully")
        setIsEditDialogOpen(false)
        fetchContactInfo()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update contact information")
      }
    } catch (error) {
      setError("An error occurred while updating contact information")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit form to add new contact info (admin only)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/contact-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: (document.getElementById("username") as HTMLInputElement).value,
          ...formData,
        }),
      })

      if (response.ok) {
        setSuccess("Contact information added successfully")
        setIsAddDialogOpen(false)
        fetchContactInfo()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add contact information")
      }
    } catch (error) {
      setError("An error occurred while adding contact information")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete contact info
  const handleDelete = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/contact-info/${currentContactId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Contact information deleted successfully")
        setIsDeleteDialogOpen(false)
        fetchContactInfo()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete contact information")
      }
    } catch (error) {
      setError("An error occurred while deleting contact information")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when opening add dialog
  const openAddDialog = () => {
    setFormData({
      unit: "",
      owner_name: "",
      phone_number: "",
      email: "",
    })
    setIsAddDialogOpen(true)
  }

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Show loading state
  if (loading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading contact information...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Information</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "admin" ? "Manage resident contact information" : "Update your contact information"}
          </p>
        </div>
        {user?.role === "admin" && (
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Resident
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md mb-6">
          <p>{success}</p>
        </div>
      )}

      {/* Admin View - Table of all residents */}
      {user?.role === "admin" && (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Unit</th>
                <th className="py-3 px-4 text-left font-medium">Owner Name</th>
                <th className="py-3 px-4 text-left font-medium">Phone Number</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Username</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactInfo.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-muted-foreground">
                    No contact information found
                  </td>
                </tr>
              ) : (
                contactInfo.map((contact) => (
                  <tr key={contact.id} className="border-b">
                    <td className="py-3 px-4">{contact.unit}</td>
                    <td className="py-3 px-4">{contact.owner_name}</td>
                    <td className="py-3 px-4">{contact.phone_number}</td>
                    <td className="py-3 px-4">{contact.email}</td>
                    <td className="py-3 px-4">{contact.username}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(contact)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(contact.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Resident View - Form to update own contact info */}
      {user?.role !== "admin" && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Contact Information</CardTitle>
            <CardDescription>Update your contact details for the building management</CardDescription>
          </CardHeader>
          <CardContent>
            {contactInfo.length === 0 ? (
              <p className="text-muted-foreground">No contact information found. Please contact the administrator.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEditClick(contactInfo[0])
                }}
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit Number</Label>
                    <Input id="unit" name="unit" value={contactInfo[0]?.unit || ""} readOnly className="bg-muted" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner_name">Owner Name</Label>
                    <Input
                      id="owner_name"
                      name="owner_name"
                      value={contactInfo[0]?.owner_name || ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={contactInfo[0]?.phone_number || ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactInfo[0]?.email || ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  <Pencil className="mr-2 h-4 w-4" />
                  Update Information
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contact Information</DialogTitle>
            <DialogDescription>Make changes to the contact information below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit Number</Label>
                <Input id="edit-unit" name="unit" value={formData.unit} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-owner_name">Owner Name</Label>
                <Input
                  id="edit-owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone_number">Phone Number</Label>
                <Input
                  id="edit-phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog (Admin Only) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resident</DialogTitle>
            <DialogDescription>Enter the contact information for the new resident.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-unit">Unit Number</Label>
                <Input id="add-unit" name="unit" value={formData.unit} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-owner_name">Owner Name</Label>
                <Input
                  id="add-owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-phone_number">Phone Number</Label>
                <Input
                  id="add-phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resident
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
