"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"

// Dynamically import client-only components with ssr: false
const AuthProviderClient = dynamic(() => import("@/contexts/auth-context").then((mod) => mod.AuthProvider), {
  ssr: false,
})

const LanguageProviderClient = dynamic(() => import("@/hooks/use-language").then((mod) => mod.LanguageProvider), {
  ssr: false,
})

export function Providers({ children }: { children: React.ReactNode }) {
  // Use client-side only rendering
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a placeholder or loading state
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProviderClient>
        <LanguageProviderClient>
          {children}
          <Toaster />
        </LanguageProviderClient>
      </AuthProviderClient>
    </ThemeProvider>
  )
}
