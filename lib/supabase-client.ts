import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a single supabase client for server components
const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Browser client singleton
let browserClient: ReturnType<typeof createClient<Database>> | null = null

// Get the browser client (client-side only)
export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowserClient should only be called on the client side")
  }

  if (!browserClient) {
    browserClient = createBrowserClient()
  }

  return browserClient
}

// Get the server client (server-side only)
export function getSupabaseServerClient() {
  return createServerClient()
}
