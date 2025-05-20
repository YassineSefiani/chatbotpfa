"use client"

import { useState, useCallback } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  metadata?: {
    language?: string
    timestamp?: number
    fallback?: boolean
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const { language } = useLanguage()
  const { toast } = useToast()

  const sendMessage = useCallback(
    async (content: string, language?: string, model?: string) => {
      setIsLoading(true)
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        metadata: { language },
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            language,
            model,
            conversationId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        const data = await response.json()
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.message,
          metadata: {
            language: data.language,
            fallback: data.fallback,
          },
        }

        setMessages((prev) => [...prev, assistantMessage])
        setConversationId(data.conversationId)
        return assistantMessage
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, toast],
  )

  const clearConversation = useCallback(() => {
    setMessages([])
    setConversationId(null)
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
    conversationId,
  }
}
