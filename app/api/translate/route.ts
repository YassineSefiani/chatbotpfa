import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { text, fromLang, toLang } = await req.json()

    if (!text || !fromLang || !toLang) {
      return NextResponse.json(
        {
          error: "Missing required parameters: text, fromLang, toLang",
        },
        { status: 400 },
      )
    }

    // In a real application, you would call a translation API like Google Translate
    // For this demo, we'll simulate translation with a delay

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simple mock translations for common phrases
    let translatedText = text

    if (fromLang === "en" && toLang === "fr") {
      translatedText = text
        .replace(/Hello/g, "Bonjour")
        .replace(/How are you/g, "Comment allez-vous")
        .replace(/Thank you/g, "Merci")
        .replace(/weather/g, "météo")
        .replace(/help/g, "aide")
    } else if (fromLang === "en" && toLang === "es") {
      translatedText = text
        .replace(/Hello/g, "Hola")
        .replace(/How are you/g, "Cómo estás")
        .replace(/Thank you/g, "Gracias")
        .replace(/weather/g, "clima")
        .replace(/help/g, "ayuda")
    } else if (fromLang === "en" && toLang === "de") {
      translatedText = text
        .replace(/Hello/g, "Hallo")
        .replace(/How are you/g, "Wie geht es Ihnen")
        .replace(/Thank you/g, "Danke")
        .replace(/weather/g, "Wetter")
        .replace(/help/g, "Hilfe")
    }

    // If no specific translation rules match, append a note
    if (translatedText === text && fromLang !== toLang) {
      translatedText += ` [Translated to ${toLang}]`
    }

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Error in translation API:", error)
    return NextResponse.json({ error: "Failed to translate text" }, { status: 500 })
  }
}
