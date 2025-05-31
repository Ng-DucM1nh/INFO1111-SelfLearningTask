"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, Home, Users, Settings } from "lucide-react"

type DashboardUser = {
  id: number
  username: string
  role: string
  name: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // User is not authenticated, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.name}!</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-lg">{user.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="mt-1">
                  {user.role === "admin" ? (
                    <>
                      <Shield className="mr-1 h-3 w-3" />
                      Administrator
                    </>
                  ) : (
                    <>
                      <Home className="mr-1 h-3 w-3" />
                      Resident
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific content */}
        {user.role === "admin" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Admin Functions
                </CardTitle>
                <CardDescription>Administrative tools and controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Residents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Building Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Security Controls
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current building system status</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>All systems operational. No issues detected.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Resident Services
                </CardTitle>
                <CardDescription>Services available to residents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Submit Maintenance Request
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Book Common Areas
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Committee
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Latest building news and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    Elevator maintenance scheduled for next week. Please use stairs during maintenance hours.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Home className="h-6 w-6" />
                <span className="text-sm">View News</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Users className="h-6 w-6" />
                <span className="text-sm">Contact Info</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Home className="h-6 w-6" />
                <span className="text-sm">Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
