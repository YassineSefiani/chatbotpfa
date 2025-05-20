"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Model, models } from "@/components/model-switcher"

interface ModelContextType {
  selectedModel: string
  setSelectedModel: (modelId: string) => void
  currentModel: Model
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Try to get the saved model from localStorage
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("selectedModel")
      // Verify that the saved model is valid
      if (savedModel && models.some((model: Model) => model.id === savedModel)) {
        return savedModel
      }
      return "meta-llama/llama-4-maverick:free"
    }
    return "meta-llama/llama-4-maverick:free"
  })

  // Save the selected model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel)
  }, [selectedModel])

  const currentModel = models.find((model: Model) => model.id === selectedModel) || models[0]

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel, currentModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider")
  }
  return context
} 