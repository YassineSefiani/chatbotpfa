import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the conversation with its messages
    const { data: conversation, error } = await supabase
      .from("conversations")
      .select(`
        id,
        created_at,
        updated_at,
        messages:messages(
          id,
          role,
          content,
          metadata,
          created_at
        )
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the conversation belongs to the user
    const { data: conversation, error: fetchError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Delete the conversation (messages will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from("conversations")
      .delete()
      .eq("id", params.id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 