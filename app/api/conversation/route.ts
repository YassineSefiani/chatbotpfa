import { type NextRequest, NextResponse } from "next/server"
import { getConversation, getRecentConversations } from "@/lib/conversation"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const userId = url.searchParams.get("userId")
    const latest = url.searchParams.get("latest") === "true"

    if (id) {
      // Get a specific conversation
      const conversation = await getConversation(id)

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }

      return NextResponse.json({ conversation })
    } else if (userId) {
      // Get conversations for a specific user
      const conversations = await getRecentConversations(userId, latest ? 1 : 10)

      if (latest && conversations.length > 0) {
        return NextResponse.json({ conversation: conversations[0] })
      }

      return NextResponse.json({ conversations })
    } else {
      // Get recent conversations (admin only in a real app)
      const conversations = await getRecentConversations()
      return NextResponse.json({ conversations })
    }
  } catch (error) {
    console.error("Error in conversation API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
