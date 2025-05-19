"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, Volume2, Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"
import { detectLanguage } from "@/lib/language-utils"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { messages, isLoading, sendMessage, clearConversation } = useChat()
  const [showFallbackWarning, setShowFallbackWarning] = useState(false)

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    error: speechError,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition()

  const { speak, cancel, isSpeaking } = useSpeechSynthesis()
  const [showClearDialog, setShowClearDialog] = useState(false)

  // Show toast when speech recognition has an error
  useEffect(() => {
    if (speechError) {
      toast({
        title: "Speech Recognition Error",
        description: speechError,
        variant: "destructive",
      })
    }
  }, [speechError, toast])

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if any message used fallback mode
  useEffect(() => {
    const hasFallbackMessage = messages.some(
      (message) => message.role === "assistant" && message.metadata && message.metadata.fallback,
    )

    if (hasFallbackMessage) {
      setShowFallbackWarning(true)
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")

    try {
      const detectedLanguage = await detectLanguage(userMessage)
      const response = await sendMessage(userMessage, detectedLanguage)

      // Check if the response used fallback mode
      if (response.metadata && response.metadata.fallback) {
        setShowFallbackWarning(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      cancel()
    } else {
      speak(text)
    }
  }

  const handleClearConversation = () => {
    clearConversation()
    setShowClearDialog(false)
    setShowFallbackWarning(false)
    toast({
      title: "Conversation cleared",
      description: "Your conversation history has been cleared.",
    })
  }

  const dismissFallbackWarning = () => {
    setShowFallbackWarning(false)
  }

  const handleMicClick = () => {
    if (!isSpeechSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Try using Chrome, Edge, or Safari.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showFallbackWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                The AI service is currently operating in fallback mode due to API quota limitations. Responses will be
                more basic until the service is fully available.
              </p>
              <Button variant="ghost" size="sm" className="mt-1 h-7 text-amber-600" onClick={dismissFallbackWarning}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              Start a conversation with the AI assistant.
              <br />
              Ask any question or just chat about your day!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[80%] rounded-lg p-4",
                message.role === "user" ? "bg-purple-100 ml-auto" : "bg-gray-100 mr-auto",
                message.metadata?.fallback ? "border border-amber-200" : "",
              )}
            >
              <div className="flex items-center mb-1">
                <span className="font-semibold">{message.role === "user" ? "You" : "AI Assistant"}</span>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2"
                    onClick={() => handleSpeakMessage(message.content)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
                {message.metadata?.fallback && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Fallback</span>
                )}
              </div>
              <p className="text-gray-800">{message.content}</p>
              {message.metadata?.language && message.metadata.language !== "en" && (
                <div className="mt-1 text-xs text-gray-500">
                  <span>Detected: {message.metadata.language}</span>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t flex justify-end">
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" disabled={messages.length === 0}>
              <Trash2 className="h-5 w-5 text-gray-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all messages in this conversation. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearConversation}>Clear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={handleMicClick}
          title={isSpeechSupported ? "Click to use voice input" : "Speech recognition not supported in this browser"}
        >
          {isListening ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type your message..."}
          className="flex-1"
          disabled={isLoading}
        />

        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-5 w-5 mr-2" />
          Send
        </Button>
      </form>

      {isListening && <div className="px-4 pb-2 text-sm text-purple-600 animate-pulse">Listening... Speak now</div>}
    </div>
  )
}
