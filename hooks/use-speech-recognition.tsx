"use client"

import { useState, useEffect, useCallback } from "react"

// Define a type for the SpeechRecognition interface
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: (event: any) => void
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null)

  // Initialize speech recognition on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setError("Speech recognition is not supported in this browser.")
        return
      }

      try {
        const recognitionInstance = new SpeechRecognition() as SpeechRecognitionInstance
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US" // Default language, can be changed

        recognitionInstance.onresult = (event) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setError(`Error: ${event.error}`)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      } catch (err) {
        console.error("Error initializing speech recognition:", err)
        setError("Failed to initialize speech recognition.")
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop()
        } catch (err) {
          console.error("Error stopping speech recognition:", err)
        }
      }
    }
  }, [])

  const startListening = useCallback(() => {
    setError(null)
    setTranscript("")

    if (recognition) {
      try {
        recognition.start()
        setIsListening(true)
      } catch (err) {
        console.error("Error starting speech recognition:", err)
        setError("Failed to start speech recognition. It might already be running.")
        setIsListening(false)
      }
    } else {
      setError("Speech recognition is not available.")
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop()
        setIsListening(false)
      } catch (err) {
        console.error("Error stopping speech recognition:", err)
      }
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    isSupported: !!recognition,
  }
}

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
