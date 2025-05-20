"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export interface Model {
  id: string
  name: string
  description: string
  provider: string
}

export const models: Model[] = [
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    description: "Meta's latest open-source model",
    provider: "Meta",
  },
  {
    id: "nousresearch/deephermes-3-mistral-24b-preview:free",
    name: "DeepHermes 3 Mistral",
    description: "Nous Research's advanced model",
    provider: "Nous",
  },
  {
    id: "qwen/qwen3-30b-a3b:free",
    name: "Qwen 3 30B",
    description: "Alibaba's powerful language model",
    provider: "Qwen",
  },
]

interface ModelSwitcherProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSwitcher({ selectedModel, onModelChange }: ModelSwitcherProps) {
  const { t } = useLanguage()
  const currentModel = models.find((model) => model.id === selectedModel) || models[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
            <span className="truncate">{t(`model.${currentModel.name.toLowerCase().replace(/\s+/g, '')}`)}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className="flex flex-col items-start"
          >
            <div className="font-medium">{t(`model.${model.name.toLowerCase().replace(/\s+/g, '')}`)}</div>
            <div className="text-xs text-gray-500">{t(`model.${model.name.toLowerCase().replace(/\s+/g, '')}.desc`)}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 