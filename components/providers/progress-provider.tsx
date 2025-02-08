"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface ProgressContextType {
  progress: number
  setProgress: (progress: number) => void
  currentStep: string
  setCurrentStep: (step: string) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Input")

  return (
    <ProgressContext.Provider value={{ progress, setProgress, currentStep, setCurrentStep }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}

