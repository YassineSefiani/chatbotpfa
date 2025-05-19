"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, X } from "lucide-react"

export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  })
  const { toast } = useToast()

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/knowledge")
      if (!response.ok) {
        throw new Error("Failed to fetch knowledge entries")
      }
      const data = await response.json()
      setEntries(data.entries)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load knowledge entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEntry,
          tags: newEntry.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add knowledge entry")
      }

      toast({
        title: "Success",
        description: "Knowledge entry added successfully",
      })

      // Reset form
      setNewEntry({
        title: "",
        content: "",
        category: "general",
        tags: "",
      })

      // Refresh entries
      fetchEntries()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add knowledge entry",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Knowledge Base Management</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Knowledge</CardTitle>
            <CardDescription>
              Add new information to train the chatbot. This knowledge will be used to answer relevant queries.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAddEntry}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="Knowledge title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newEntry.category}
                    onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Enter the knowledge content..."
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  placeholder="ai, chatbot, help, etc."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setNewEntry({
                    title: "",
                    content: "",
                    category: "general",
                    tags: "",
                  })
                }
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Entries</CardTitle>
            <CardDescription>View and manage existing knowledge entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={fetchEntries} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Entries"}
              </Button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No knowledge entries found. Add some knowledge to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {entry.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-gray-700">{entry.content}</p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.map((tag: string, i: number) => (
                            <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
