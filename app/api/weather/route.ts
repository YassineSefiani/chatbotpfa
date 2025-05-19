import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const location = url.searchParams.get("location")

    if (!location) {
      return NextResponse.json({ error: "Location parameter is required" }, { status: 400 })
    }

    // In a real application, you would call a weather API like OpenWeatherMap
    // For this demo, we'll return mock data

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock weather data
    const weatherData = {
      location: location,
      temperature: Math.floor(Math.random() * 15) + 10, // Random temperature between 10-25°C
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // Random wind speed between 5-25 km/h
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error in weather API:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
