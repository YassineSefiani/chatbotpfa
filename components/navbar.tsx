"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageSquare, Home, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthButton } from "@/components/auth-button"

export default function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg group-hover:scale-105 transition-transform">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Intelligent Chatbot
              </span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "flex items-center transition-colors",
                  pathname === item.href
                    ? "bg-purple-50 text-purple-700"
                    : "hover:bg-purple-50/50 hover:text-purple-700"
                )}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex md:hidden">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="icon"
                  asChild
                  className={cn(
                    "transition-colors",
                    pathname === item.href
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-purple-50/50 hover:text-purple-700"
                  )}
                >
                  <Link href={item.href}>{item.icon}</Link>
                </Button>
              ))}
            </div>

            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
