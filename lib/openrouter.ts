import OpenAI from "openai"

export interface OpenRouterMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface OpenRouterCompletionOptions {
  model: string
  messages: OpenRouterMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

const API_KEYS = {
  default: process.env.OPENROUTER_API_KEY,
  nous: process.env.OPENROUTER_NOUS_API_KEY,
  qwen: process.env.OPENROUTER_QWEN_API_KEY,
}

function getApiKeyForModel(model: string): string {
  console.log("Getting API key for model:", model)
  if (model.startsWith("nousresearch")) {
    console.log("Using Nous API key")
    return API_KEYS.nous || ""
  }
  if (model.startsWith("qwen")) {
    console.log("Using Qwen API key")
    return API_KEYS.qwen || ""
  }
  console.log("Using default API key")
  return API_KEYS.default || ""
}

export function getOpenRouterClient(model: string = "meta-llama/llama-4-maverick:free") {
  const apiKey = getApiKeyForModel(model)
  if (!apiKey) {
    throw new Error("OpenRouter API key is missing")
  }

  console.log("Creating OpenRouter client with model:", model)

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Intelligent Chatbot",
    },
  })
}

export async function openRouterCompletion(
  options: OpenRouterCompletionOptions,
  apiKey: string,
): Promise<{ text: string }> {
  const { model, messages, temperature = 0.7, max_tokens = 500 } = options

  console.log("Making completion request with model:", model)

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Intelligent Chatbot",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: false,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("OpenRouter API error:", error)
    throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`)
  }

  const data = await response.json()
  return { text: data.choices[0].message.content }
}

// Stream version for future use
export async function openRouterCompletionStream(
  options: OpenRouterCompletionOptions,
  apiKey: string,
): Promise<ReadableStream> {
  const { model, messages, temperature = 0.7, max_tokens = 500 } = options

  console.log("Making stream request with model:", model)

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Intelligent Chatbot",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("OpenRouter API error:", error)
    throw new Error(`OpenRouter API error: ${error}`)
  }

  return response.body as ReadableStream
}
