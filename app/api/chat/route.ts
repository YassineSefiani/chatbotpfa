import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getOpenRouterClient } from "@/lib/openrouter"

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const { message, language, model = "meta-llama/llama-4-maverick:free" } = await req.json()

    console.log("Using model:", model)

    // Get or create conversation ID
    let conversationId = cookieStore.get("conversationId")?.value
    if (!conversationId) {
      conversationId = Date.now().toString()
      cookieStore.set("conversationId", conversationId, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    // Get AI response
    const openRouter = getOpenRouterClient(model)
    console.log("OpenRouter client created with model:", model)

    const response = await openRouter.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Respond in the same language as the user's message.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    })

    const aiResponse = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."

    return NextResponse.json({
      message: aiResponse,
      conversationId,
      language,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        message: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        fallback: true,
      },
      { status: 500 },
    )
  }
}
