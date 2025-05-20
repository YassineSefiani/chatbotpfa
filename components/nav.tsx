"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function Nav() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: t("language.en") },
    { code: "fr", name: t("language.fr") },
    { code: "es", name: t("language.es") },
    { code: "de", name: t("language.de") },
    { code: "it", name: t("language.it") },
    { code: "pt", name: t("language.pt") },
    { code: "ru", name: t("language.ru") },
    { code: "zh", name: t("language.zh") },
    { code: "ja", name: t("language.ja") },
    { code: "ar", name: t("language.ar") },
  ] as const

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold text-purple-600">
          AI Chat
        </Link>
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              pathname === "/"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/chat"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              pathname === "/chat"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {t("nav.chat")}
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-[100px] justify-between">
              <Globe className="h-4 w-4 mr-2" />
              <span>{t(`language.${language}`)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code as "en" | "fr" | "es")}
                className={cn(
                  "cursor-pointer",
                  language === lang.code && "bg-purple-50 text-purple-700"
                )}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm">
          {t("nav.signin")}
        </Button>
      </div>
    </nav>
  )
} 