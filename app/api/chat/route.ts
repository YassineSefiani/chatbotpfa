import { type NextRequest, NextResponse } from "next/server"
import { moderateContent } from "@/lib/api-services"
import { getKnowledgeBase } from "@/lib/knowledge-base"
import { createConversation, addMessage } from "@/lib/conversation"
import { openRouterCompletion } from "@/lib/openrouter"

// Enhanced fallback response generator that uses the knowledge base
function generateFallbackResponse(userMessage: string, relevantKnowledge: string | null): string {
  const userQuestion = userMessage.toLowerCase()

  // If we have relevant knowledge, use it to craft a response
  if (relevantKnowledge) {
    const knowledgeLines = relevantKnowledge.split("\n\n")
    return `Based on what I know: ${knowledgeLines[0]}`
  }

  // Common greetings
  if (userQuestion.includes("hello") || userQuestion.includes("hi") || userQuestion.includes("hey")) {
    return "Hello! I'm your AI assistant. How can I help you today?"
  }

  // Questions about the assistant
  if (userQuestion.includes("how are you") || userQuestion.includes("how do you feel")) {
    return "I'm functioning well, thank you for asking! I'm here to assist you with information and answer your questions."
  }

  // Weather related
  if (userQuestion.includes("weather")) {
    return "I'd be happy to tell you about the weather. Could you specify which location you're interested in?"
  }

  // Help requests
  if (userQuestion.includes("help") || userQuestion.includes("can you")) {
    return "I'm here to help! I can answer questions, provide information on various topics, or just chat. What would you like to know about?"
  }

  // Questions
  if (
    userQuestion.includes("what") ||
    userQuestion.includes("who") ||
    userQuestion.includes("when") ||
    userQuestion.includes("where") ||
    userQuestion.includes("why") ||
    userQuestion.includes("how")
  ) {
    return "That's an interesting question. I'm currently operating in fallback mode due to API limitations, but I'd be happy to try answering that when the service is fully available."
  }

  // Default response
  return "I appreciate your message. I'm currently operating with limited capabilities due to API quota limitations. I'd be happy to continue our conversation with basic responses, or you could try again later when the full service might be available."
}

export async function POST(req: NextRequest) {
  try {
    const { messages, language, conversationId, userId } = await req.json()

    // Extract the latest user message
    const latestMessage = messages[messages.length - 1]

    // Check content moderation
    const moderationResult = await moderateContent(latestMessage.content)

    if (!moderationResult.isSafe) {
      return NextResponse.json(
        {
          error: "Content moderation failed",
          details: moderationResult.categories,
        },
        { status: 400 },
      )
    }

    // Only create or update conversation in database if user is logged in
    let currentConversationId = conversationId

    if (userId) {
      // User is logged in, store conversation in database
      if (!currentConversationId) {
        currentConversationId = await createConversation(userId)
      }

      // Store the user message
      await addMessage(currentConversationId, "user", latestMessage.content, {
        language: language,
        timestamp: Date.now(),
      })
    }

    // Get relevant knowledge for the query
    const relevantKnowledge = await getKnowledgeBase(latestMessage.content)

    // Format conversation history for the AI
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add system message at the beginning
    const systemMessage = {
      role: "system" as const,
      content: `You are an intelligent, helpful, and friendly assistant. You can engage in casual conversation and provide information on a wide range of topics.
${
  relevantKnowledge
    ? `Here is some specific information that might help with this query:
${relevantKnowledge}

Use this information if relevant to the query, but don't explicitly mention that you're using a knowledge base.`
    : ""
}

Please provide helpful, accurate, and conversational responses. Be concise but thorough.

${language !== "en" ? `Please respond in ${language}.` : ""}`,
    }

    let text = ""
    let usedFallback = false

    try {
      // Check if OpenRouter API key is available
      const openRouterApiKey = process.env.OPENROUTER_API_KEY

      if (!openRouterApiKey) {
        throw new Error("OpenRouter API key is missing")
      }

      // Use OpenRouter API with Llama 4 Maverick
      const response = await openRouterCompletion(
        {
          model: "meta-llama/llama-4-maverick:free",
          messages: [systemMessage, ...formattedMessages],
          temperature: 0.7,
          max_tokens: 500,
        },
        openRouterApiKey,
      )

      text = response.text
    } catch (error: any) {
      usedFallback = true
      console.error("Error generating AI response:", error)

      // Generate fallback response
      text = generateFallbackResponse(latestMessage.content, relevantKnowledge)

      // Add language adaptation if needed
      if (language !== "en") {
        text += ` (Note: This is a fallback response in English. Translation would be available when the service is fully operational.)`
      }
    }

    // Only store assistant message if user is logged in
    if (userId && currentConversationId) {
      await addMessage(currentConversationId, "assistant", text, {
        timestamp: Date.now(),
        fallback: usedFallback,
      })
    }

    return NextResponse.json({
      response: text,
      conversationId: currentConversationId,
      usedFallback: usedFallback,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
