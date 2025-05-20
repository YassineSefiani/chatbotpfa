"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, Volume2, Trash2, AlertTriangle, Plus, MessageSquare, ThumbsUp, ThumbsDown, Code, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"
import { detectLanguage } from "@/lib/language-utils"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { useModel } from "@/contexts/model-context"
import { ModelSwitcher } from "@/components/model-switcher"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { messages, isLoading, sendMessage, clearConversation, conversationId } = useChat()
  const [showFallbackWarning, setShowFallbackWarning] = useState(false)
  const { selectedModel, setSelectedModel } = useModel()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { t } = useLanguage()

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
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput("")

    try {
      const detectedLanguage = await detectLanguage(userMessage)
      const response = await sendMessage(userMessage, detectedLanguage, selectedModel)

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
      title: t("chat.clear"),
      description: t("chat.clearconfirmdesc"),
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
    toast({
      title: t("chat.copied"),
      description: t("chat.copieddesc"),
    })
  }

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    toast({
      title: "Thank you!",
      description: `Your feedback has been recorded.`,
    })
  }

  const renderMessageContent = (content: string) => {
    // Check for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = content.split(codeBlockRegex)
    
    return parts.map((part, index) => {
      if (index % 3 === 0) {
        // Regular text
        return <p key={index}>{part}</p>
      } else if (index % 3 === 1) {
        // Language identifier
        return null
      } else {
        // Code content
        const language = parts[index - 1] || "plaintext"
        return (
          <div key={index} className="relative group">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              className="rounded-lg !mt-2 !mb-2"
            >
              {part}
            </SyntaxHighlighter>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopyCode(part)}
            >
              {copiedCode === part ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )
      }
    })
  }

  return (
    <div className="relative h-[600px] flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowClearDialog(true)}
            disabled={messages.length === 0}
            className="hover:bg-purple-100"
          >
            <Plus className="h-5 w-5 text-purple-600" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-800">{t("chat.new")}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <ModelSwitcher selectedModel={selectedModel} onModelChange={setSelectedModel} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowClearDialog(true)}
            disabled={messages.length === 0}
            className="hover:bg-red-100"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-purple-50/30">
        {showFallbackWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                {t("chat.fallbackwarning")}
              </p>
              <Button variant="ghost" size="sm" className="mt-1 h-7 text-amber-600" onClick={dismissFallbackWarning}>
                {t("chat.dismiss")}
              </Button>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-gray-500 text-lg">
                {t("chat.startconversation")}
                <br />
                {t("chat.askanything")}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[80%] rounded-2xl p-4 shadow-sm",
                message.role === "user"
                  ? "bg-purple-600 text-white ml-auto"
                  : "bg-white border border-gray-100 mr-auto",
                message.metadata?.fallback ? "border border-amber-200" : "",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="font-semibold">{message.role === "user" ? "You" : "AI Assistant"}</span>
                  {message.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => handleSpeakMessage(message.content)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                  {message.metadata?.fallback && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      {t("chat.fallback")}
                    </span>
                  )}
                </div>
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-green-600"
                            onClick={() => handleFeedback(message.id, true)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("chat.helpful")}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-red-600"
                            onClick={() => handleFeedback(message.id, false)}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("chat.nothelpful")}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
              <div className={message.role === "user" ? "text-white" : "text-gray-800"}>
                {renderMessageContent(message.content)}
              </div>
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

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={handleMicClick}
            title={isSpeechSupported ? t("chat.speak") : "Speech recognition not supported in this browser"}
            className={cn(
              "hover:bg-purple-100",
              isListening && "bg-red-100 hover:bg-red-200"
            )}
          >
            {isListening ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? t("chat.listening") : t("chat.placeholder")}
            className="flex-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          />

          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="h-5 w-5 mr-2" />
            {t("chat.send")}
          </Button>
        </form>

        {isListening && (
          <div className="mt-2 text-sm text-purple-600 animate-pulse flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-bounce" />
            {t("chat.listening")} {t("chat.speak")}
          </div>
        )}
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("chat.clearconfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("chat.clearconfirmdesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("chat.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearConversation}>{t("chat.clearaction")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
