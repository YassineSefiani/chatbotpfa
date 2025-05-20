import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { ModelProvider } from "@/contexts/model-context"
import LanguageProvider from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Intelligent Chatbot",
  description: "A modern AI chatbot with multiple model support",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ModelProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </ModelProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
