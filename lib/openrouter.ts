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

export async function openRouterCompletion(
  options: OpenRouterCompletionOptions,
  apiKey: string,
): Promise<{ text: string }> {
  const { model, messages, temperature = 0.7, max_tokens = 500 } = options

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://your-site-url.com", // Replace with your actual site URL
      "X-Title": "Intelligent Chatbot", // Replace with your app name
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://your-site-url.com", // Replace with your actual site URL
      "X-Title": "Intelligent Chatbot", // Replace with your app name
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
    throw new Error(`OpenRouter API error: ${error}`)
  }

  return response.body as ReadableStream
}
