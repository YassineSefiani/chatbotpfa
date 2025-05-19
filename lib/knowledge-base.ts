import { getSupabaseServerClient } from "./supabase-client"

// Knowledge base types
export type KnowledgeEntry = {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

// Function to search the knowledge base
export async function getKnowledgeBase(query: string): Promise<string | null> {
  try {
    const supabase = getSupabaseServerClient()

    // Extract keywords from the query
    const keywords = extractKeywords(query)

    if (keywords.length === 0) {
      return null
    }

    // Search for relevant entries in the knowledge base
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .or(keywords.map((keyword) => `content.ilike.%${keyword}%`).join(","))
      .limit(3)

    if (error) {
      console.error("Error fetching from knowledge base:", error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    // Format the knowledge entries
    return data
      .map((entry: KnowledgeEntry) => `KNOWLEDGE [${entry.category}]: ${entry.title}\n${entry.content}`)
      .join("\n\n")
  } catch (error) {
    console.error("Error in knowledge base retrieval:", error)
    return null
  }
}

// Function to extract keywords from a query
function extractKeywords(query: string): string[] {
  // Remove common words and punctuation
  const stopWords = [
    "a",
    "an",
    "the",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "like",
    "through",
    "over",
    "before",
    "after",
    "between",
    "under",
    "above",
    "of",
    "and",
    "or",
    "what",
    "when",
    "where",
    "who",
    "how",
    "why",
    "which",
    "do",
    "does",
    "did",
    "have",
    "has",
    "had",
    "am",
    "can",
    "could",
    "would",
    "should",
    "will",
    "shall",
    "may",
    "might",
  ]

  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word))

  // Return unique keywords
  return [...new Set(words)]
}

// Function to add new knowledge to the database
export async function addKnowledgeEntry(
  entry: Omit<KnowledgeEntry, "id" | "created_at" | "updated_at">,
): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.from("knowledge_base").insert([
      {
        ...entry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error adding knowledge entry:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in addKnowledgeEntry:", error)
    return false
  }
}
