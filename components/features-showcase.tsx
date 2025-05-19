"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Cloud, Database, Globe, Lightbulb, Mic, Shield, Zap } from "lucide-react"
import { fetchWeather } from "@/lib/api-services"
import Link from "next/link"

export default function FeaturesShowcase() {
  const [weatherLocation, setWeatherLocation] = useState("")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleWeatherSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!weatherLocation.trim()) return

    setIsLoading(true)
    try {
      const data = await fetchWeather(weatherLocation)
      setWeatherData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Features</CardTitle>
        <CardDescription>Explore the capabilities of our intelligent chatbot</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capabilities" className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="capabilities">Core</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="capabilities" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Multilingual Support</h3>
                  <p className="text-sm text-gray-500">Communicate in multiple languages with automatic detection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mic className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Voice Interaction</h3>
                  <p className="text-sm text-gray-500">Speak to the chatbot and listen to responses</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Contextual Understanding</h3>
                  <p className="text-sm text-gray-500">Maintains conversation context for natural interactions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Content Moderation</h3>
                  <p className="text-sm text-gray-500">Automatic filtering of inappropriate content</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cloud className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Weather Information</h3>
                  <p className="text-sm text-gray-500 mb-2">Get real-time weather data for any location</p>

                  <form onSubmit={handleWeatherSearch} className="flex gap-2">
                    <Input
                      value={weatherLocation}
                      onChange={(e) => setWeatherLocation(e.target.value)}
                      placeholder="Enter location"
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" disabled={isLoading}>
                      Search
                    </Button>
                  </form>

                  {weatherData && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{weatherData.location}</div>
                      <div className="text-2xl">{weatherData.temperature}°C</div>
                      <div className="text-sm">{weatherData.condition}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Knowledge Base</h3>
                  <p className="text-sm text-gray-500 mb-2">Add custom knowledge to train the chatbot</p>
                  <Link href="/knowledge">
                    <Button size="sm" variant="outline">
                      Manage Knowledge Base
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Hybrid AI Approach</h3>
                  <p className="text-sm text-gray-500">
                    Combines pre-trained models with custom knowledge and external data sources
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 flex items-center justify-center text-purple-600 mt-0.5">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-medium">Continuous Learning</h3>
                  <p className="text-sm text-gray-500">
                    The system improves over time based on interactions and feedback
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
