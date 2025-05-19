"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageSquare, Home } from "lucide-react"
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
    <nav className="bg-white border-b py-3 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-xl">Intelligent Chatbot</span>
        </Link>

        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn("flex items-center", pathname === item.href && "bg-purple-50 text-purple-700")}
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
                className={cn(pathname === item.href && "bg-purple-50 text-purple-700")}
              >
                <Link href={item.href}>{item.icon}</Link>
              </Button>
            ))}
          </div>

          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
