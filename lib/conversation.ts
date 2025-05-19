import { getSupabaseServerClient } from "./supabase-client"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  metadata?: {
    language?: string
    timestamp?: number
  }
}

export type Conversation = {
  id: string
  messages: Message[]
  userId?: string
  createdAt: string
  updatedAt: string
}

// Create a new conversation
export async function createConversation(userId?: string): Promise<string> {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("conversations")
      .insert([{ user_id: userId || null }])
      .select("id")
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      throw error
    }

    return data.id
  } catch (error) {
    console.error("Error in createConversation:", error)
    throw error
  }
}

// Add a message to a conversation
export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  metadata?: any,
): Promise<string> {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          role,
          content,
          metadata: metadata || {},
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("Error adding message:", error)
      throw error
    }

    // Update the conversation's updated_at timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    return data.id
  } catch (error) {
    console.error("Error in addMessage:", error)
    throw error
  }
}

// Get a conversation by ID
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  try {
    const supabase = getSupabaseServerClient()

    // Get the conversation
    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (conversationError) {
      console.error("Error fetching conversation:", conversationError)
      return null
    }

    // Get the messages for this conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return null
    }

    // Format the messages
    const messages = messagesData.map((message: any) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      metadata: message.metadata,
    }))

    return {
      id: conversationData.id,
      messages,
      userId: conversationData.user_id,
      createdAt: conversationData.created_at,
      updatedAt: conversationData.updated_at,
    }
  } catch (error) {
    console.error("Error in getConversation:", error)
    return null
  }
}

// Get recent conversations
export async function getRecentConversations(userId?: string, limit = 10): Promise<Conversation[]> {
  try {
    const supabase = getSupabaseServerClient()

    let query = supabase.from("conversations").select("*").order("updated_at", { ascending: false }).limit(limit)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: conversationsData, error: conversationsError } = await query

    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError)
      return []
    }

    const conversations: Conversation[] = []

    for (const conv of conversationsData) {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true })

      if (messagesError) {
        console.error("Error fetching messages:", messagesError)
        continue
      }

      const messages = messagesData.map((message: any) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        metadata: message.metadata,
      }))

      conversations.push({
        id: conv.id,
        messages,
        userId: conv.user_id,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
      })
    }

    return conversations
  } catch (error) {
    console.error("Error in getRecentConversations:", error)
    return []
  }
}
