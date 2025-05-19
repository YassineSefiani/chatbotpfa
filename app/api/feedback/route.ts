import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (would use environment variables in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function POST(req: NextRequest) {
  try {
    const { rating, comment } = await req.json()

    // Validate required fields
    if (!rating) {
      return NextResponse.json({ error: "Rating is required" }, { status: 400 })
    }

    // If Supabase is configured, store feedback
    if (supabase) {
      const { error } = await supabase.from("feedback").insert([
        {
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true })
    }

    // If Supabase is not configured, simulate success
    console.log("Feedback received (not stored):", { rating, comment })
    return NextResponse.json({
      success: true,
      message: "Feedback would be stored in production environment",
    })
  } catch (error) {
    console.error("Error storing feedback:", error)
    return NextResponse.json({ error: "Failed to store feedback" }, { status: 500 })
  }
}
