"use client"

import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useLanguage } from "./use-language"
import { useAuth } from "@/contexts/auth-context"

export type Message = {
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
  const { user } = useAuth()

  // Load conversation from localStorage or API when user changes
  useEffect(() => {
    const loadConversation = async () => {
      // Clear messages when user changes (sign in or sign out)
      setMessages([])
      setConversationId(null)

      if (!user) {
        return
      }

      try {
        // Try to get the most recent conversation for this user
        const response = await fetch(`/api/conversation?userId=${user.id}&latest=true`)

        if (response.ok) {
          const data = await response.json()

          if (data.conversation) {
            setConversationId(data.conversation.id)
            setMessages(data.conversation.messages || [])
          }
        }
      } catch (error) {
        console.error("Error loading conversation:", error)
      }
    }

    loadConversation()
  }, [user])

  const sendMessage = useCallback(
    async (content: string, detectedLanguage?: string) => {
      setIsLoading(true)

      try {
        // Add user message to the chat
        const userMessage: Message = {
          id: uuidv4(),
          role: "user",
          content,
          metadata: {
            language: detectedLanguage,
            timestamp: Date.now(),
          },
        }

        setMessages((prev) => [...prev, userMessage])

        // Process with AI and get response
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            language,
            conversationId,
            userId: user?.id, // Only include userId if user is logged in
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get AI response")
        }

        const data = await response.json()

        // Save the conversation ID if it's new and user is logged in
        if (user && data.conversationId && (!conversationId || conversationId !== data.conversationId)) {
          setConversationId(data.conversationId)
        }

        // Add AI response to the chat
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: data.response,
          metadata: {
            timestamp: Date.now(),
            fallback: data.usedFallback,
          },
        }

        setMessages((prev) => [...prev, assistantMessage])
        return assistantMessage
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [messages, language, conversationId, user],
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
