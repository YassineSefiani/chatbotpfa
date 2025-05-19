import { Suspense } from "react"
import ChatInterface from "@/components/chat-interface"
import LanguageSelector from "@/components/language-selector"
import FeaturesShowcase from "@/components/features-showcase"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Intelligent Conversational Assistant</h1>
        <p className="text-xl text-white/90 text-center max-w-2xl">
          An advanced AI chatbot that can chat about anything and answer your questions
        </p>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Chat Interface</h2>
                <LanguageSelector />
              </div>
              <Suspense fallback={<div className="p-8 text-center">Loading chat interface...</div>}>
                <ChatInterface />
              </Suspense>
            </div>
          </div>

          <div className="hidden md:block">
            <FeaturesShowcase />
          </div>
        </div>
      </div>
    </main>
  )
}
