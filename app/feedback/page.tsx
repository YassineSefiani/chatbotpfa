"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState({
    rating: "",
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.rating) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedback),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully",
      })

      // Reset form
      setFeedback({
        rating: "",
        comment: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Provide Feedback</h1>

      <Card>
        <CardHeader>
          <CardTitle>Help Us Improve</CardTitle>
          <CardDescription>Your feedback helps us train the AI and improve the chatbot experience</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>How would you rate your experience?</Label>
              <RadioGroup
                value={feedback.rating}
                onValueChange={(value) => setFeedback({ ...feedback, rating: value })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="positive" id="positive" />
                  <Label htmlFor="positive" className="flex items-center">
                    <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
                    Positive
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="negative" id="negative" />
                  <Label htmlFor="negative" className="flex items-center">
                    <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
                    Negative
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Additional Comments</Label>
              <Textarea
                id="comment"
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                placeholder="Please share your thoughts on the chatbot's responses..."
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
