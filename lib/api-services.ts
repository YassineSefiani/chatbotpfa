// This file contains functions for external API integrations

export async function fetchWeather(location: string) {
  // In a real application, you would call a weather API
  // For this demo, we'll return mock data

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock weather data
  return {
    location: location,
    temperature: Math.floor(Math.random() * 15) + 10, // Random temperature between 10-25°C
    condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // Random wind speed between 5-25 km/h
  }
}

export async function fetchNews(category = "general") {
  // In a real application, you would call a news API
  // For this demo, we'll return mock data

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock news data
  const newsItems = [
    {
      title: "New AI Breakthrough Announced",
      description: "Researchers have developed a new AI model that can understand context better than ever before.",
      source: "Tech News",
      url: "#",
      publishedAt: new Date().toISOString(),
    },
    {
      title: "Climate Change Conference Begins",
      description: "World leaders gather to discuss new initiatives to combat climate change.",
      source: "World News",
      url: "#",
      publishedAt: new Date().toISOString(),
    },
    {
      title: "Stock Markets Hit New Record",
      description: "Global stock markets reached new heights amid positive economic forecasts.",
      source: "Financial Times",
      url: "#",
      publishedAt: new Date().toISOString(),
    },
  ]

  return newsItems
}

export async function moderateContent(text: string): Promise<{
  isSafe: boolean
  categories: {
    hate: number
    harassment: number
    selfHarm: number
    sexual: number
    violence: number
  }
}> {
  // In a real application, you would call a content moderation API
  // For this demo, we'll implement a simple keyword-based check

  const lowerText = text.toLowerCase()

  // Check for potentially harmful content
  const harmfulPatterns = {
    hate: ["hate", "racist", "bigot"],
    harassment: ["harass", "bully", "threat"],
    selfHarm: ["suicide", "self-harm", "kill myself"],
    sexual: ["explicit", "porn", "xxx"],
    violence: ["kill", "attack", "bomb"],
  }

  const results = {
    isSafe: true,
    categories: {
      hate: 0,
      harassment: 0,
      selfHarm: 0,
      sexual: 0,
      violence: 0,
    },
  }

  // Check each category
  for (const [category, patterns] of Object.entries(harmfulPatterns)) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        results.categories[category as keyof typeof results.categories] = 0.9
        results.isSafe = false
      }
    }
  }

  return results
}
