import { NextResponse } from "next/server"

export const runtime = "edge"

// This function would typically use the user's IP to determine location
// For demo purposes, we'll return mock weather data
export async function GET(request: Request) {
  // Get the IP address from the request headers
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"

  // In a real app, you would use the IP to determine location
  // and then fetch real weather data from a weather API

  // Mock weather data
  const weatherData = {
    location: "Building Location",
    temperature: 22, // Celsius
    condition: "Sunny",
    humidity: 45,
    windSpeed: 10,
    forecast: [
      { day: "Today", high: 24, low: 18, condition: "Sunny" },
      { day: "Tomorrow", high: 22, low: 17, condition: "Partly Cloudy" },
      { day: "Wednesday", high: 20, low: 16, condition: "Rainy" },
    ],
    lastUpdated: new Date().toISOString(),
  }

  return NextResponse.json(weatherData)
}
