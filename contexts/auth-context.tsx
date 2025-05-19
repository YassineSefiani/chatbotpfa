"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: any }>
  signInWithProvider: (provider: "github" | "google") => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Only initialize Supabase client on the client side
  const supabase = typeof window !== "undefined" ? getSupabaseBrowserClient() : null

  useEffect(() => {
    if (!supabase) return

    const fetchSession = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
          throw error
        }

        setSession(session)
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    console.log("Signing in with:", email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("Sign in result:", data?.user?.email, error?.message)
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    console.log("Signing up with:", email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log("Sign up result:", data?.user?.email, error?.message)
    return { data, error }
  }

  const signInWithProvider = async (provider: "github" | "google") => {
    if (!supabase) throw new Error("Supabase client not initialized")

    console.log("Signing in with provider:", provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("OAuth error:", error)
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) throw new Error("Supabase client not initialized")

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Default export for dynamic import
export default { AuthProvider }
