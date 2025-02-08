interface Step {
  title: string
  description: string
}

interface StepsProps {
  steps: Step[]
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-medium text-primary">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

