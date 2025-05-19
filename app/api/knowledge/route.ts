import { type NextRequest, NextResponse } from "next/server"
import { addKnowledgeEntry } from "@/lib/knowledge-base"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (would use environment variables in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

// Mock data for when Supabase is not configured
const mockEntries = [
  {
    id: "1",
    title: "Weather Information",
    content:
      "The chatbot can provide general weather information and forecasts. For specific locations, users can use the weather feature in the interface.",
    category: "weather",
    tags: ["weather", "forecast", "temperature"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "News Updates",
    content:
      "The chatbot can provide summaries of recent news across various categories including technology, politics, business, sports, and entertainment.",
    category: "news",
    tags: ["news", "current events", "updates"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Multilingual Support",
    content:
      "The chatbot supports multiple languages including English, French, Spanish, German, Italian, Portuguese, Russian, Chinese, Japanese, and Arabic.",
    category: "general",
    tags: ["languages", "translation", "multilingual"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function GET(req: NextRequest) {
  try {
    // If Supabase is configured, fetch from database
    if (supabase) {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return NextResponse.json({ entries: data })
    }

    // Otherwise return mock data
    return NextResponse.json({ entries: mockEntries })
  } catch (error) {
    console.error("Error fetching knowledge entries:", error)
    return NextResponse.json({ error: "Failed to fetch knowledge entries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    // If Supabase is configured, add to database
    if (supabase) {
      const success = await addKnowledgeEntry({
        title: body.title,
        content: body.content,
        category: body.category,
        tags: Array.isArray(body.tags) ? body.tags : [],
      })

      if (!success) {
        throw new Error("Failed to add knowledge entry")
      }

      return NextResponse.json({ success: true })
    }

    // If Supabase is not configured, simulate success
    return NextResponse.json({
      success: true,
      message: "Knowledge entry would be added in production environment",
    })
  } catch (error) {
    console.error("Error adding knowledge entry:", error)
    return NextResponse.json({ error: "Failed to add knowledge entry" }, { status: 500 })
  }
}
