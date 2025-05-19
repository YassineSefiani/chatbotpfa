"use client"

import { useState, useCallback, useEffect } from "react"

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSupported, setIsSupported] = useState(false)

  // Initialize and check for support
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true)

      // Get available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length > 0) {
          setVoices(availableVoices)
        }
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  const speak = useCallback(
    (text: string, voiceIndex?: number) => {
      if (!isSupported) return

      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        // Set voice if specified and available
        if (voiceIndex !== undefined && voices.length > 0) {
          utterance.voice = voices[voiceIndex % voices.length]
        }

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
        }

        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Error in speech synthesis:", error)
        setIsSpeaking(false)
      }
    },
    [voices, isSupported],
  )

  const cancel = useCallback(() => {
    if (!isSupported) return

    try {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } catch (error) {
      console.error("Error canceling speech:", error)
    }
  }, [isSupported])

  return {
    speak,
    cancel,
    isSpeaking,
    voices,
    isSupported,
  }
}
