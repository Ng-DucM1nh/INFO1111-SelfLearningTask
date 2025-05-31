"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"error" | "success">("error")
  const [systemStatus, setSystemStatus] = useState({ acceptingLogins: true, message: "" })

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            // User is already logged in, redirect to home
            router.push("/")
          }
        }
      } catch (error) {
        // User is not logged in, stay on login page
      }
    }

    checkAuth()
  }, [router])

  // GET request to check if the system is accepting logins
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch("/api/auth/status")
        const data = await response.json()
        setSystemStatus(data)
      } catch (error) {
        console.error("Failed to check system status:", error)
      }
    }

    checkSystemStatus()
  }, [])

  // Handle form submission (POST request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      // POST request to submit login credentials
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage("Login successful! Redirecting...")
        setMessageType("success")

        // Redirect to home page after successful login
        setTimeout(() => {
          router.push("/")
          // Force a reload to update the navbar
          window.location.href = "/"
        }, 1500)
      } else {
        setMessage(data.error || "Login failed. Please try again.")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Log in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {!systemStatus.acceptingLogins && (
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>{systemStatus.message || "Login system is currently unavailable."}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className={`mb-4 ${messageType === "success" ? "bg-green-50" : "bg-red-50"}`}>
              {messageType === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <InfoIcon className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={messageType === "success" ? "text-green-600" : "text-red-600"}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
            <p className="font-medium text-gray-700">Demo Credentials:</p>
            <p className="text-gray-600">Admin: admin / thegodlyadmin</p>
            <p className="text-gray-600">Resident: resident / powerlessresident</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleSubmit} disabled={isLoading || !systemStatus.acceptingLogins}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
