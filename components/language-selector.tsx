"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage, type Language } from "@/contexts/language-context"

export default function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { value: "en", label: t("language.en") },
    { value: "fr", label: t("language.fr") },
    { value: "es", label: t("language.es") },
    { value: "de", label: t("language.de") },
    { value: "it", label: t("language.it") },
    { value: "pt", label: t("language.pt") },
    { value: "ru", label: t("language.ru") },
    { value: "zh", label: t("language.zh") },
    { value: "ja", label: t("language.ja") },
    { value: "ar", label: t("language.ar") },
  ]

  const selectedLanguage = languages.find((l) => l.value === language) || languages[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[180px] justify-between">
          <Globe className="mr-2 h-4 w-4" />
          {selectedLanguage.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder={t("language.select")} />
          <CommandList>
            <CommandEmpty>{t("language.notfound")}</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    setLanguage(currentValue as Language)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", language === lang.value ? "opacity-100" : "opacity-0")} />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
