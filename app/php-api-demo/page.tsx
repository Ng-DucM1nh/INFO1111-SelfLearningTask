"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PhpApiDemoPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Call our PHP proxy API
      const res = await fetch("/api/php-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError("Failed to connect to the PHP service")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-3xl font-bold">PHP API Integration</h1>
        <p className="text-gray-500">This page demonstrates integration with a PHP API through a Next.js proxy.</p>

        <Card>
          <CardHeader>
            <CardTitle>Contact Form (PHP Backend)</CardTitle>
            <CardDescription>This form submits data to a PHP API through a Next.js proxy</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50">
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <Alert className="mb-4 bg-green-50">
                <AlertDescription className="text-green-600">
                  Response received from PHP API: {JSON.stringify(response)}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit to PHP API"}
            </Button>
          </CardFooter>
        </Card>

        <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
          <h3 className="text-lg font-medium">How This Works</h3>
          <p className="mt-2">
            This page sends data to a Next.js API route, which forwards the request to a PHP API. The PHP code processes
            the data and returns a response, which is then displayed on this page.
          </p>
          <p className="mt-2">
            Note: You need to host your PHP code on a separate server that can accept API requests.
          </p>
        </div>
      </div>
    </div>
  )
}
