import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all conversations for the user with their latest message as preview
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        created_at,
        updated_at,
        messages:messages(
          content
        )
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      throw error
    }

    // Format the conversations to include a preview
    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      preview: conv.messages?.[0]?.content?.slice(0, 50) || "Empty conversation",
    }))

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 