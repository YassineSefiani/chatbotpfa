import { Suspense } from "react"
import ChatInterface from "@/components/chat-interface"
import LanguageSelector from "@/components/language-selector"
import FeaturesShowcase from "@/components/features-showcase"
import Navbar from "@/components/navbar"
import { MessageSquare, Sparkles, Brain, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white text-center">
              Intelligent Conversational Assistant
            </h1>
          </div>
          <p className="text-xl text-white/90 text-center max-w-2xl mb-8">
            Experience the future of AI-powered conversations with our advanced chatbot
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-white">Advanced AI</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Brain className="h-5 w-5 text-purple-300" />
              <span className="text-white">Smart Learning</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Zap className="h-5 w-5 text-blue-300" />
              <span className="text-white">Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Chat Interface</h2>
                <LanguageSelector />
              </div>
              <Suspense fallback={
                <div className="p-8 text-center">
                  <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="h-12 w-12 bg-purple-200 rounded-full" />
                    <div className="h-4 w-32 bg-purple-200 rounded" />
                  </div>
                </div>
              }>
                <ChatInterface />
              </Suspense>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8">
              <FeaturesShowcase />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Intelligent Chatbot. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
