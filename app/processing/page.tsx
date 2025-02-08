"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/components/providers/progress-provider"
import { ProgressCircle } from "@/components/ui/progress-circle"

export default function Processing() {
  const router = useRouter()
  const { progress, setProgress, currentStep, setCurrentStep } = useProgress()

  useEffect(() => {
    setCurrentStep("Processing")
    let currentProgress = 15

    const interval = setInterval(() => {
      if (currentProgress < 85) {
        currentProgress += 5
        setProgress(currentProgress)
      } else {
        clearInterval(interval)
        router.push("/results")
      }
    }, 200)

    return () => clearInterval(interval)
  }, [router, setProgress, setCurrentStep])

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-6 text-2xl font-bold">Analyzing Your PG&E Bill</h1>
        <div className="mb-8">
          <ProgressCircle progress={progress} size={160} />
        </div>
        <p className="text-lg text-gray-600">Please wait while we analyze your information...</p>
        <div className="mt-8 text-sm text-gray-500">
          Looking up billions of records to find your savings opportunities
        </div>
      </div>
    </div>
  )
}

