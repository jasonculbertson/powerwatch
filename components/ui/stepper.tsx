import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number
  steps: string[]
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index < currentStep
                ? "bg-accent border-accent text-accent-foreground"
                : index === currentStep
                  ? "border-accent text-accent"
                  : "border-muted-foreground text-muted-foreground"
            }`}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
          >
            {step}
          </span>
          {index < steps.length - 1 && <div className="ml-4 w-10 h-0.5 bg-muted-foreground/30"></div>}
        </div>
      ))}
    </div>
  )
}

